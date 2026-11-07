/**
 * Lightweight Zero-Dependency Local CMS Server
 * Built with native Node.js modules (http, fs, path).
 * Allows managing portfolio projects locally and auto-saving directly to data/projects.json.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_FILE = path.join(ROOT_DIR, 'data', 'projects.json');
const UPLOAD_DIR = path.join(ROOT_DIR, 'assets', 'images');

// Ensure directories exist
if (!fs.existsSync(path.join(ROOT_DIR, 'data'))) {
  fs.mkdirSync(path.join(ROOT_DIR, 'data'), { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function readProjects() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, '[]', 'utf8');
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading projects.json:', err);
    return [];
  }
}

function writeProjects(projects) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), 'utf8');
}

const server = http.createServer((req, res) => {
  // CORS Headers for flexible development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // --- REST API ENDPOINTS ---
  if (pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', mode: 'filesystem-write', timestamp: new Date().toISOString() }));
    return;
  }

  if (pathname === '/api/projects' && req.method === 'GET') {
    const projects = readProjects();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(projects));
    return;
  }

  if (pathname === '/api/projects' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        let projects = readProjects();

        if (Array.isArray(payload)) {
          // Bulk replace
          projects = payload;
        } else {
          // Single create or update
          const newProject = {
            id: payload.id || 'project-' + Date.now(),
            title: payload.title || 'Untitled Project',
            subtitle: payload.subtitle || '',
            category: payload.category || 'web',
            role: payload.role || '',
            period: payload.period || new Date().getFullYear().toString(),
            description: payload.description || '',
            overview: payload.overview || '',
            keyFeatures: Array.isArray(payload.keyFeatures) ? payload.keyFeatures : [],
            tags: Array.isArray(payload.tags) ? payload.tags : [],
            image: payload.image || '',
            links: payload.links || {},
            featured: Boolean(payload.featured),
            order: payload.order !== undefined ? Number(payload.order) : projects.length + 1
          };

          const existingIdx = projects.findIndex(p => p.id === newProject.id);
          if (existingIdx >= 0) {
            projects[existingIdx] = newProject;
          } else {
            projects.push(newProject);
          }
        }

        writeProjects(projects);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Saved to projects.json', count: projects.length }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload', details: err.message }));
      }
    });
    return;
  }

  if (pathname.startsWith('/api/projects/') && req.method === 'DELETE') {
    const id = decodeURIComponent(pathname.replace('/api/projects/', ''));
    let projects = readProjects();
    const initialLen = projects.length;
    projects = projects.filter(p => p.id !== id);

    if (projects.length === initialLen) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Project not found' }));
      return;
    }

    writeProjects(projects);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: `Project ${id} deleted` }));
    return;
  }

  // Upload endpoint (accepts JSON { filename, base64 })
  if (pathname === '/api/upload' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { filename, base64 } = JSON.parse(body);
        if (!filename || !base64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'filename and base64 fields are required' }));
          return;
        }

        // Sanitize filename
        const safeName = Date.now() + '-' + path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
        const cleanBase64 = base64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
        const buffer = Buffer.from(cleanBase64, 'base64');

        const filePath = path.join(UPLOAD_DIR, safeName);
        fs.writeFileSync(filePath, buffer);

        const publicUrl = `assets/images/${safeName}`;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, url: publicUrl, filename: safeName }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Upload failed', details: err.message }));
      }
    });
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security: Prevent directory traversal outside ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access denied');
    return;
  }

  // If path is a directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(res);
  } else {
    // 404 fallback
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>404 Not Found</h1><p>Cannot find ${pathname}</p><p><a href="/">Return Home</a></p>`);
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✨ Andi Ghafa Portfolio & CMS Server is running!`);
  console.log(`🌐 Website:      http://localhost:${PORT}`);
  console.log(`🛠️ CMS Studio:  http://localhost:${PORT}/admin.html`);
  console.log(`💾 Storage:      Direct Disk-Write (${DATA_FILE})`);
  console.log(`======================================================\n`);
});

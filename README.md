# Andi Ziyadh Ghafa Ramadhan — Portfolio & Built-in CMS

A modern, high-performance developer portfolio built with an **Editorial Bento Grid**, Swiss typography, responsive dark/light theme engine, and a **zero-dependency CMS Studio** to easily add and manage showcase projects without modifying code.

---

## 🚀 Key Features

### 1. Portfolio Experience
- **Editorial Bento Grid & Modern Engineering Aesthetic**: High-performance layout with audited typography (`Plus Jakarta Sans`, `Inter`, `JetBrains Mono`), tactile press feedback, and zero generic AI slop.
- **Enterprise Showcase**: Real-world production systems deployed across UNESCO World Heritage sites (PT Taman Wisata Candi Borobudur, Prambanan & Ratu Boko) and public portals.
- **Interactive Documentation**: Built-in interactive technical manuals for enterprise architectures (`docs/venue-booking-system-documentation.html`, `docs/pos-system-documentation.html`).
- **Dynamic Project Filtering**: Filter by category (*All*, *Full-Stack Web*, *Mobile*, *AI & ML*, *Systems & OOP*) and instant keyword search.
- **Project Detail Modal Drawer**: Click any card or "Quick View" to inspect architecture, screenshots, key contributions, and direct links (*Live Demo*, *Interactive Docs*, *Manual/PDF*, *GitHub*, *Drive*).
- **Dark & Light Mode**: WCAG 2.1 AAA/AA compliant contrast ratios (&ge; 4.5:1 text, &ge; 3:1 borders), system preference detection, dynamic theme color matching, and smooth transitions.
- **Mobile-Native Ergonomics**: 16px input minimums (no iOS auto-zoom), notch & safe-area insets (`env(safe-area-inset-top)`), and gated `:hover` states to eliminate sticky taps on touch screens.
- **1-Click Copy Email & Feedback Toasts**: Floating notifications for instant feedback.
- **Academic & Experience Highlights**: Showcasing Telkom University (Cum Laude, 3.66 GPA), published Computer Vision defense paper, Lecturer Assistantship (30+ students in C++), and MTCNA certification.

### 2. Built-in CMS Studio (`admin.html`)
- **Is a CMS possible for static portfolios?** **Yes!** This repo includes a dedicated CMS Studio that operates in two flexible modes:
  1. **Direct Disk-Write Mode (Local Node Server)**: Run `npm start` &mdash; adding/editing projects or uploading images directly writes to `data/projects.json` and `assets/images/` on disk with zero manual file handling!
  2. **Static / GitHub Pages Mode (Client-Side)**: Open `admin.html` directly in any browser &mdash; draft projects, live-preview cards, and download the updated `projects.json` with 1 click to commit to Git.
- **Shortcut**: Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> (or <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd>) on the live portfolio to jump directly into the CMS Studio!

---

## 📁 Project Architecture

```text
andi-portofolio/
├── index.html            # Main portfolio entry point (lightweight, accessible)
├── admin.html            # CMS Studio dashboard for managing projects
├── server.js             # Optional zero-dependency Node.js CMS server (native http/fs)
├── package.json          # npm start / dev scripts
├── data/
│   └── projects.json     # Single source of truth for all portfolio projects
├── css/
│   └── style.css         # Bento grid layout, CSS design tokens, light/dark themes
├── js/
│   └── app.js            # Reactive rendering, filters, search, modal & toast controller
├── assets/
│   └── images/           # Showcase screenshots (aspire.png, favehotel.jpg, library.png)
├── Andi_Ghafa_CV.pdf     # Résumé
├── porto 1.pdf           # FaveHotel Laundry App User Manual
├── porto 2.pdf           # ASPIRE Platform User Manual
└── porto 3.pdf           # Library Management System Manual
```

---

## 🛠️ How to Run Locally

### Option A: With Local CMS Server (Recommended for adding projects)
Requires Node.js (already installed on your machine):

```bash
# 1. Start the server
npm start
# or: node server.js

# 2. Open in your browser:
#    Portfolio:   http://localhost:3000
#    CMS Studio:  http://localhost:3000/admin.html
```
*In this mode, clicking "Save Project" writes directly to `data/projects.json` and uploads image files to `assets/images/`.*

### Option B: Standalone Static Mode (Zero Server Needed)
Simply double-click `index.html` or open it with any browser/VS Code Live Server. The site loads dynamic projects from `data/projects.json` automatically!

---

## 📝 How to Add a New Project via CMS

1. Open `admin.html` (or click **CMS** in the navigation bar).
2. Click **"Add New Project"**.
3. Fill in:
   - **Title & Tagline** (e.g. *E-Commerce Cloud Architecture*)
   - **Category** (*Web*, *Mobile*, *AI*, *System*)
   - **Role & Period** (e.g. *Full-Stack Lead*, *2026*)
   - **Card Summary & Full Overview**
   - **Key Features** (click *+ Add Feature* for bullet points)
   - **Tech Tags** (e.g. *Next.js, TypeScript, PostgreSQL*)
   - **Image** (upload an image file or type a URL)
   - **Links** (*Live Demo*, *Manual/PDF*, *GitHub*, *Drive*)
   - **Featured toggle** (makes the card a wide 2-column bento banner)
4. Click **"Save Project"**:
   - If `server.js` is running: it automatically saves directly to disk!
   - If running as a static site: click **"Export JSON"** to download `projects.json`, then place it in the `data/` folder and push to Git.

---

## 🌐 Deploying to GitHub Pages / Vercel

### GitHub Pages:
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Upgrade portfolio with modern UI/UX and CMS Studio"
   git push origin main
   ```
2. In GitHub repository settings &rarr; **Pages**, set source to branch `main` and root `/`.
3. Your portfolio is live with all features working!

### Vercel / Netlify:
- Connect the GitHub repository &mdash; it deploys statically instantly with zero build setup required.

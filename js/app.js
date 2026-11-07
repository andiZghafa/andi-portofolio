/**
 * Andi Ziyadh Ghafa Ramadhan — Portfolio Client Controller
 * Architecture: Modular Vanilla JS with Reactive State, Search & Filter,
 * Dynamic Modal Drawer, Theme Engine, and Toast Manager.
 */

(function () {
  'use strict';

  // --- STATE ---
  let projects = [];
  let activeFilter = 'all';
  let searchQuery = '';

  // DOM Elements
  const projectsGrid = document.getElementById('projectsGrid');
  const projectCount = document.getElementById('projectCount');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const searchInput = document.getElementById('projectSearch');
  const themeToggle = document.getElementById('themeToggle');
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalContent');
  const toastContainer = document.getElementById('toastContainer');

  // --- THEME MANAGEMENT ---
  function updateThemeMeta(theme) {
    const color = theme === 'dark' ? '#0a0f18' : '#fbf9f4';
    let metaTheme = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute('content', color);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('andi-portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    updateThemeMeta(theme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('andi-portfolio-theme', nextTheme);
    updateThemeIcon(nextTheme);
    updateThemeMeta(nextTheme);
    showToast(`Switched to ${nextTheme} mode`, 'info');
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = theme === 'dark' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    themeToggle.innerHTML = icon;
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  // --- DATA LOADING & FALLBACK ---
  async function loadProjects() {
    try {
      // 1. Try fetching from live local server API or data file
      const res = await fetch('data/projects.json?t=' + Date.now());
      if (res.ok) {
        projects = await res.json();
      } else {
        throw new Error('Could not load data/projects.json');
      }
    } catch (err) {
      console.warn('Fallback: checking local storage or embedded fallback', err);
      const cached = localStorage.getItem('andi-portfolio-projects');
      if (cached) {
        projects = JSON.parse(cached);
      } else {
        projects = getDefaultProjects();
      }
    }

    // Merge any draft projects from localStorage (CMS live-preview sync)
    const localDrafts = localStorage.getItem('andi-cms-drafts');
    if (localDrafts) {
      try {
        const drafts = JSON.parse(localDrafts);
        if (Array.isArray(drafts) && drafts.length >= projects.length) {
          projects = drafts;
        }
      } catch (e) {
        console.error('Error parsing CMS drafts:', e);
      }
    }

    // Sort projects by order
    projects.sort((a, b) => (a.order || 99) - (b.order || 99));
    renderProjects();
  }

  // Fallback defaults in case server or json is inaccessible
  function getDefaultProjects() {
    return [
      {
        id: "twc-pos-system",
        title: "Prambanan & Ratu Boko Enterprise Point of Sale (POS)",
        subtitle: "Mission-Critical Cashier & Multi-Warehouse System across UNESCO Heritage Parks",
        category: "system",
        role: "Full-Stack & Mobile Engineer",
        period: "2026",
        description: "Enterprise point-of-sale ecosystem deployed across cashier ticketing counters in Candi Prambanan and Candi Ratu Boko, featuring offline-first resilience, multi-warehouse inventory mutations, and direct Bluetooth thermal ESC/POS printing.",
        overview: "Engineered a high-concurrency point-of-sale and retail management system operating live at ticketing and merchant locations across Prambanan and Ratu Boko tourist complexes under PT Taman Wisata Candi Borobudur, Prambanan & Ratu Boko (TWC / InJourney). Built as a reactive Single Page Application (SPA) combining Laravel 13, Inertia.js 3, and React 19, alongside a native Android APK build via Capacitor that bridges directly to Bluetooth Classic (SPP) thermal printers (BP-LITE80D) for instantaneous receipt printing without browser print dialogs. Manages multi-warehouse inventory, cashier shift reconciliation, and automated WhatsApp transaction dispatch.",
        keyFeatures: [
          "Native Android Bluetooth Classic (SPP) ESC/POS printing bridge eliminating print dialog delays (<0.5s auto-cut)",
          "Multi-Warehouse Inventory Architecture tracking real-time stock mutations, transfers, and FEFO batch allocations",
          "Cashier Shift Lifecycle engine with cash float verification, drawer reconciliation, and comprehensive audit logs",
          "Multi-channel payment gateway integration with dynamic QRIS (Midtrans & Xendit), bank transfers, and open-bills",
          "Automated WhatsApp digital receipt and daily reporting microservice powered by Node.js and whatsapp-web.js",
          "Robust enterprise security with Spatie RBAC, password confirmation step-ups, and anti-bot protection"
        ],
        tags: ["Laravel", "Inertia.js", "React", "Capacitor", "Android", "Bluetooth ESC/POS", "Tailwind CSS", "MySQL", "Midtrans"],
        image: "assets/images/pos-checkout.png",
        fallbackImage: "assets/images/pos-dashboard.png",
        links: {
          manual: "docs/pos-system-documentation.html"
        },
        featured: true,
        order: 1
      },
      {
        id: "twc-venue-booking",
        title: "TWC Multi-Destination Venue Booking & Scheduling Platform",
        subtitle: "Internal Enterprise Scheduling & Seating Layout System across Borobudur, Prambanan & Ratu Boko",
        category: "web",
        role: "Full-Stack Developer",
        period: "2026",
        description: "Internal enterprise scheduling platform utilized by PT Taman Wisata Candi to coordinate multi-day venue bookings, load-in setup windows, and tiered seating layouts without double-booking conflicts.",
        overview: "Designed and developed an internal web enterprise platform for PT Taman Wisata Candi Borobudur, Prambanan & Ratu Boko (TWC / InJourney). The system coordinates high-capacity venue rentals across 3 premier heritage destinations (such as Lapangan Garuda, Trimurti Stage, and Ramayana Ballet stages). It features an atomic scheduling validation engine that accounts for multi-phase windows (load-in setup, main event, and tear-down unload) to eliminate scheduling collisions, coupled with an interactive seat allocation module and destination-scoped user permissions.",
        keyFeatures: [
          "Multi-phase conflict detection engine validating load-in, event, and tear-down windows before confirming bookings",
          "Dynamic Seating Chart Management (`kursi`) with row-and-column tier mapping for Ramayana Ballet Prambanan stages",
          "Destination-scoped Role-Based Access Control (Sales scoped to single sites; Admins manage cross-destination bookings)",
          "Comprehensive client history CRM, PIC assignment workflow, and per-user notification read-state tracking",
          "Modern, fast enterprise UI built with Laravel 13, Blade Components, Tailwind CSS 4, and Vite"
        ],
        tags: ["Laravel", "PHP", "Tailwind CSS", "MySQL", "Blade", "Vite", "Enterprise Scheduling", "TWC InJourney"],
        image: "assets/images/venue-booking-bg.jpg",
        fallbackImage: "assets/images/venue-booking-logo.png",
        links: {
          manual: "docs/venue-booking-system-documentation.html"
        },
        featured: true,
        order: 2
      },
      {
        id: "museum-prambanan",
        title: "Museum Candi Prambanan — Official Web Portal & Digital Catalog",
        subtitle: "Public Heritage Museum Platform & Historical Artifact Catalog",
        category: "web",
        role: "Full-Stack Developer",
        period: "2026",
        description: "Official public web portal and digital museum catalog for Prambanan Temple Museum, featuring interactive archaeological artifact galleries, visitor counters, and a curator CMS dashboard.",
        overview: "Architected and built the official web portal for Museum Candi Prambanan (`museumprambanan.twc.id`) under PT Taman Wisata Candi. The platform provides global tourists, archaeologists, and researchers with an immersive digital window into historical stone inscriptions (such as Prasasti Siwagrha and Prasasti Klurak), temple relics, and cultural stories. Includes a real-time visitor counter, curated educational exhibitions, and an administrative content management system for museum curators.",
        keyFeatures: [
          "Public digital artifact & historical site (`situs`) catalog with high-resolution media galleries and historical annotations",
          "Live visitor tracking counter and engagement analytics module",
          "Curator CMS dashboard for managing educational collections, multimedia assets, and exhibition updates",
          "Mobile-first, accessible interface with optimized asset loading built on Laravel, Tailwind CSS, and Vite",
          "Deployed and running live in production at the official domain `museumprambanan.twc.id`"
        ],
        tags: ["Laravel", "Tailwind CSS", "PHP", "MySQL", "Vite", "Public Portal", "Cultural Heritage", "REST API"],
        image: "assets/images/museum-hero.jpg",
        fallbackImage: "assets/images/museum-icon.png",
        links: {
          demo: "https://museumprambanan.twc.id"
        },
        featured: true,
        order: 3
      },
      {
        id: "aspire",
        title: "ASPIRE — Career & Course Recommendation Platform",
        subtitle: "AI-Powered Academic & Career Guidance System",
        category: "ai",
        role: "Project Manager & Lead Full-Stack Developer",
        period: "2025 - 2026",
        description: "An AI-powered platform that parses student academic transcripts (PDF) and leverages LLM analysis to recommend personalized career paths and targeted courses required to qualify for them.",
        overview: "ASPIRE was developed as a capstone team project addressing the disconnect between university curricula and real-world industry demands. As Project Manager and Full-Stack Lead alongside one developer, I architected the end-to-end pipeline: from PDF document ingestion and structured data extraction to prompting large language models for intelligent career gap analysis and course matching.",
        keyFeatures: [
          "Automated PDF transcript parser converting messy academic records into structured student profiles",
          "LLM integration providing contextual career trajectory matching and skill deficiency diagnostics",
          "Dynamic course planner recommending specific university electives mapped to target job roles",
          "Responsive, clean dashboard built with Next.js App Router and Tailwind CSS"
        ],
        tags: ["Next.js", "TypeScript", "MongoDB", "LLM Integration", "Tailwind CSS"],
        image: "assets/images/aspire.png",
        fallbackImage: "porto2.png",
        links: {
          demo: "https://aspire-mu.vercel.app/",
          manual: "porto 2.pdf"
        },
        featured: false,
        order: 4
      },
      {
        id: "favehotel-app",
        title: "FaveHotel Laundry & Inventory Mobile App",
        subtitle: "QR-Code Driven Operational Logbook & Inventory Tracking",
        category: "mobile",
        role: "Solo Developer & Software Engineering Intern",
        period: "Jul 2025 - Sep 2025",
        description: "Custom mobile application built to replace legacy manual paper logbooks in hotel operations, featuring real-time QR inventory tracking, cloud spreadsheet sync, and automated kitchen closing tools.",
        overview: "During my industrial internship at FaveHotel Bogor, hotel operations relied on paper laundry logs and manual stock-taking, causing discrepancies and delays. I designed, engineered, and deployed a production-ready mobile application from scratch. The solution empowered operational staff to scan linen batches via QR codes, log weights and room numbers, and sync directly to Google Sheets in real time.",
        keyFeatures: [
          "High-speed QR code camera scanner for bulk linen batch and amenity tracking",
          "Live bi-directional synchronization with cloud spreadsheets for immediate management reporting",
          "Kitchen closing-time validation utility and checklist to enforce hygiene and equipment shutdown protocols",
          "End-to-end user testing and on-site staff training sessions conducted solo"
        ],
        tags: ["Flutter", "Dart", "QR Scanner", "Spreadsheet API", "Mobile UX"],
        image: "assets/images/favehotel.jpg",
        fallbackImage: "porto.jpeg",
        links: {
          drive: "https://drive.google.com/drive/folders/14KmCJALAOIj8jx7pWVYclDdgkDH3fQur?usp=sharing",
          manual: "porto 1.pdf"
        },
        featured: false,
        order: 5
      },
      {
        id: "library-system",
        title: "Console-Based Library Management System",
        subtitle: "Object-Oriented System with Role-Based Access Control",
        category: "system",
        role: "Coursework Project / Core Developer",
        period: "2024",
        description: "Comprehensive console application implementing strict Object-Oriented Programming (OOP) paradigms and custom data structures for multi-role library cataloging, borrowing, and inventory management.",
        overview: "Built as an intensive academic project to demonstrate master-level comprehension of core OOP principles and memory-efficient data structures. Features dual-role permissions (Administrator and Guest), transaction ledger records, author-indexed search trees, and comprehensive input validation.",
        keyFeatures: [
          "Role-Based Access Control (RBAC) separating administrative stock control from guest search and borrowing",
          "Dynamic catalog searching indexed by author, ISBN, category, and availability",
          "Transaction tracking module with due-date calculation and return validation",
          "Robust input sanitization and exception handling preventing state corruption"
        ],
        tags: ["Java", "OOP", "Data Structures", "RBAC", "Console UI"],
        image: "assets/images/library.png",
        fallbackImage: "porto 3.png",
        links: {
          manual: "porto 3.pdf"
        },
        featured: false,
        order: 6
      }
    ];
  }

  // --- RENDERING PROJECTS ---
  function renderProjects() {
    if (!projectsGrid) return;

    // Filter projects
    const filtered = projects.filter(p => {
      const matchCategory = activeFilter === 'all' || p.category.toLowerCase() === activeFilter.toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.role && p.role.toLowerCase().includes(query)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));
      
      return matchCategory && matchSearch;
    });

    if (projectCount) {
      projectCount.textContent = `${filtered.length} project${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      projectsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border: 1px dashed var(--border-strong); border-radius: var(--radius-lg);">
          <svg style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <h3 style="font-family: var(--font-display); font-size: 18px; margin-bottom: 6px;">No projects found</h3>
          <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">Try adjusting your search query or category filter.</p>
          <button id="resetFilterBtn" class="btn btn-secondary" style="font-size: 13px; padding: 6px 14px;">Reset filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeFilter = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          updateFilterButtons();
          renderProjects();
        });
      }
      return;
    }

    projectsGrid.innerHTML = filtered.map(p => createProjectCardHTML(p)).join('');

    // Attach listeners
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking on an external link directly, don't trigger modal
        if (e.target.closest('a')) return;
        const id = card.dataset.id;
        openProjectModal(id);
      });
    });

    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.openModal;
        openProjectModal(id);
      });
    });
  }

  function createProjectCardHTML(p) {
    const isFeatured = Boolean(p.featured);
    const categoryLabels = {
      web: 'Full-Stack Web',
      mobile: 'Mobile App',
      ai: 'AI & Machine Learning',
      system: 'Systems & OOP'
    };
    const catLabel = categoryLabels[p.category] || p.category.toUpperCase();

    const imgSrc = p.image || p.fallbackImage || 'assets/images/aspire.png';
    const fallbackSrc = p.fallbackImage || p.image || 'assets/images/aspire.png';

    const tagsHTML = (p.tags || []).slice(0, 5).map(tag => `
      <span class="tech-chip">${escapeHTML(tag)}</span>
    `).join('');

    // Links
    let linksHTML = '';
    if (p.links) {
      if (p.links.demo) {
        linksHTML += `
          <a href="${escapeHTML(p.links.demo)}" target="_blank" rel="noopener noreferrer" class="project-link" title="Open Live Demo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Live Demo
          </a>
        `;
      }
      if (p.links.manual) {
        linksHTML += `
          <a href="${escapeHTML(p.links.manual)}" download class="project-link" title="Download User Manual">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            Manual (PDF)
          </a>
        `;
      }
      if (p.links.drive) {
        linksHTML += `
          <a href="${escapeHTML(p.links.drive)}" target="_blank" rel="noopener noreferrer" class="project-link" title="Open Google Drive">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
            Drive
          </a>
        `;
      }
    }

    return `
      <article class="project-card ${isFeatured ? 'featured' : ''}" data-id="${p.id}" tabindex="0" role="button" aria-label="View details for ${escapeHTML(p.title)}">
        <div class="project-thumb-wrap">
          <img 
            src="${escapeHTML(imgSrc)}" 
            alt="${escapeHTML(p.title)} screenshot" 
            class="project-thumb-img" 
            loading="lazy"
            onerror="this.onerror=null; this.src='${escapeHTML(fallbackSrc)}';"
          />
          <div class="thumb-overlay">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            Quick View
          </div>
        </div>
        <div class="project-content">
          <div class="project-meta-row">
            <span class="category-tag">${catLabel}</span>
            <span class="project-period">${escapeHTML(p.period || '')}</span>
          </div>
          <h3 class="project-title">${escapeHTML(p.title)}</h3>
          ${p.role ? `<div class="project-role">${escapeHTML(p.role)}</div>` : ''}
          <p class="project-desc">${escapeHTML(p.description)}</p>
          <div class="tags-row">${tagsHTML}</div>
          <div class="project-actions-row">
            <div class="project-links-group">${linksHTML}</div>
            <button class="btn-quick-view" data-open-modal="${p.id}">
              Details &rarr;
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // --- PROJECT MODAL DRAWER ---
  function openProjectModal(id) {
    const p = projects.find(item => item.id === id);
    if (!p || !projectModal || !modalContent) return;

    const imgSrc = p.image || p.fallbackImage || 'assets/images/aspire.png';
    const fallbackSrc = p.fallbackImage || p.image || 'assets/images/aspire.png';

    const featuresHTML = (p.keyFeatures && p.keyFeatures.length > 0)
      ? `
        <div style="margin-top: 20px;">
          <h4 style="font-family: var(--font-display); font-size: 15px; font-weight: 700; margin-bottom: 10px; color: var(--text-primary);">Key Architectural Highlights &amp; Features</h4>
          <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px; color: var(--text-secondary); font-size: 14.5px;">
            ${p.keyFeatures.map(f => `<li>${escapeHTML(f)}</li>`).join('')}
          </ul>
        </div>
      `
      : '';

    const tagsHTML = (p.tags || []).map(t => `<span class="tech-chip" style="font-size: 12px; padding: 4px 10px;">${escapeHTML(t)}</span>`).join('');

    let actionButtonsHTML = '';
    if (p.links) {
      if (p.links.demo) {
        actionButtonsHTML += `
          <a href="${escapeHTML(p.links.demo)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 13.5px; padding: 9px 18px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Visit Live Demo
          </a>
        `;
      }
      if (p.links.manual) {
        actionButtonsHTML += `
          <a href="${escapeHTML(p.links.manual)}" download class="btn btn-secondary" style="font-size: 13.5px; padding: 9px 18px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            Download User Manual (PDF)
          </a>
        `;
      }
      if (p.links.drive) {
        actionButtonsHTML += `
          <a href="${escapeHTML(p.links.drive)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 13.5px; padding: 9px 18px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
            View on Google Drive
          </a>
        `;
      }
      if (p.links.github) {
        actionButtonsHTML += `
          <a href="${escapeHTML(p.links.github)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 13.5px; padding: 9px 18px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            Source Code
          </a>
        `;
      }
    }

    modalContent.innerHTML = `
      <div class="modal-img-wrap">
        <img 
          src="${escapeHTML(imgSrc)}" 
          alt="${escapeHTML(p.title)}"
          onerror="this.onerror=null; this.src='${escapeHTML(fallbackSrc)}';"
        />
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
        <span class="category-tag">${escapeHTML(p.category.toUpperCase())}</span>
        <span style="font-family: var(--font-mono); font-size: 12.5px; color: var(--text-muted);">${escapeHTML(p.period || '')}</span>
      </div>
      <h2 style="font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
        ${escapeHTML(p.title)}
      </h2>
      ${p.role ? `<div style="font-size: 14.5px; font-weight: 600; color: var(--accent); margin-bottom: 16px;">${escapeHTML(p.role)}</div>` : ''}
      <div style="font-size: 15px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px;">
        ${escapeHTML(p.overview || p.description)}
      </div>
      ${featuresHTML}
      <div style="margin-top: 24px;">
        <h4 style="font-family: var(--font-display); font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--text-primary);">Tech Stack &amp; Tools</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">${tagsHTML}</div>
      </div>
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border-subtle); display: flex; flex-wrap: wrap; gap: 12px;">
        ${actionButtonsHTML}
      </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- TOAST MANAGER ---
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

    toast.innerHTML = `${icon}<span>${escapeHTML(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  // Helper: Escape HTML
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function updateFilterButtons() {
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === activeFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- INITIALIZATION & EVENT LISTENERS ---
  function initEvents() {
    // Theme Switcher
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    // Category Filters
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        updateFilterButtons();
        renderProjects();
      });
    });

    // Search Input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProjects();
      });
    }

    // Modal Close
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeProjectModal);
    }
    if (projectModal) {
      projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
          closeProjectModal();
        }
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeProjectModal();
      }
      // Secret Developer / CMS Studio shortcut: Ctrl+Shift+A or Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = 'admin.html';
      }
    });

    // Copy Email to Clipboard
    const copyEmailBtns = document.querySelectorAll('[data-copy-email]');
    copyEmailBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = btn.dataset.copyEmail || 'ghafaat@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard!`, 'success');
        }).catch(() => {
          showToast(`Contact: ${email}`, 'info');
        });
      });
    });

    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Boot up
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEvents();
    loadProjects();
  });

  // Expose global for potential CMS sync
  window.AndiPortfolio = {
    loadProjects,
    showToast,
    openProjectModal
  };
})();

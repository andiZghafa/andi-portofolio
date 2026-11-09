/**
 * Andi Ziyadh Ghafa Ramadhan: Portfolio Client Controller
 * Architecture: Modular Vanilla JS with Reactive State, Project Disclosure,
 * Dynamic Modal Drawer, Theme Engine, and Toast Manager.
 */

(function () {
  "use strict";

  // --- STATE ---
  let projects = [];
  const FEATURED_FALLBACK_COUNT = 5;

  // DOM Elements
  const projectsGrid = document.getElementById("projectsGrid");
  const projectsMoreGrid = document.getElementById("projectsMoreGrid");
  const projectsAcc = document.getElementById("projectsAcc");
  const themeToggle = document.getElementById("themeToggle");
  const projectModal = document.getElementById("projectModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalContent = document.getElementById("modalContent");
  const toastContainer = document.getElementById("toastContainer");

  // --- THEME MANAGEMENT ---
  function updateThemeMeta(theme) {
    const color = theme === "dark" ? "#14213D" : "#F4EDE0";
    let metaTheme = document.querySelector(
      'meta[name="theme-color"]:not([media])',
    );
    if (!metaTheme) {
      metaTheme = document.createElement("meta");
      metaTheme.setAttribute("name", "theme-color");
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute("content", color);

    // Sync SVG favicon rim accent with active theme state
    const faviconEl = document.getElementById("siteFavicon");
    if (faviconEl) {
      const rimColor = theme === "dark" ? "%23FF6B5B" : "%23F4EDE0";
      const rimOpacity = theme === "dark" ? "0.42" : "0.16";
      faviconEl.setAttribute(
        "href",
        `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none'><rect width='32' height='32' rx='8' fill='%2314213D'/><rect x='0.5' y='0.5' width='31' height='31' rx='7.5' stroke='${rimColor}' stroke-opacity='${rimOpacity}' stroke-width='1'/><path d='M11.75 9.5L7.75 22.5' stroke='%23FF6B5B' stroke-width='2.8' stroke-linecap='round'/><path d='M15.25 22.5L19.5 9.5L23.75 22.5' stroke='%23F4EDE0' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/><path d='M16.75 18.25H22.25' stroke='%23F4EDE0' stroke-width='2.4' stroke-linecap='round'/></svg>`,
      );
    }
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("andi-portfolio-theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const theme = savedTheme || (systemPrefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeIcon(theme);
    updateThemeMeta(theme);
  }

  function toggleTheme() {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("andi-portfolio-theme", nextTheme);
    updateThemeIcon(nextTheme);
    updateThemeMeta(nextTheme);
    showToast(`Switched to ${nextTheme} mode`, "info");
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    if (themeToggle.classList.contains("t-icon-swap")) {
      themeToggle.setAttribute("data-state", theme);
    } else {
      const icon =
        theme === "dark"
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
      themeToggle.innerHTML = icon;
    }
    themeToggle.setAttribute(
      "aria-label",
      `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
    );
  }

  // --- DATA LOADING & FALLBACK ---
  async function loadProjects() {
    try {
      // 1. Try fetching from live local server API or data file
      const res = await fetch("data/projects.json?t=" + Date.now());
      if (res.ok) {
        projects = await res.json();
      } else {
        throw new Error("Could not load data/projects.json");
      }
    } catch (err) {
      console.warn(
        "Fallback: checking local storage or embedded fallback",
        err,
      );
      const cached = localStorage.getItem("andi-portfolio-projects");
      if (cached) {
        projects = JSON.parse(cached);
      } else {
        projects = getDefaultProjects();
      }
    }

    // Merge any draft projects from localStorage (CMS live-preview sync)
    const localDrafts = localStorage.getItem("andi-cms-drafts");
    if (localDrafts) {
      try {
        const drafts = JSON.parse(localDrafts);
        if (Array.isArray(drafts) && drafts.length >= projects.length) {
          projects = drafts;
        }
      } catch (e) {
        console.error("Error parsing CMS drafts:", e);
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
        subtitle:
          "Cashier & Multi-Warehouse ERP System across UNESCO Heritage Complex",
        category: "web",
        categories: ["web", "system"],
        categoryLabel: "Full-Stack Web & POS System",
        role: "IT Development and Data Management Intern",
        period: "Aug 2026 - Present",
        description:
          "Enterprise point-of-sale ecosystem deployed across cashier ticketing counters in Candi Prambanan and Keraton Ratu Boko, featuring offline-first resilience, multi-warehouse inventory mutations, and direct Bluetooth thermal ESC/POS printing.",
        overview:
          "Engineered a high-concurrency point-of-sale and retail management system operating live at ticketing and merchant locations across Prambanan and Ratu Boko tourist complexes under PT Taman Wisata Candi Borobudur, Prambanan & Ratu Boko (TWC / InJourney). Built as a reactive Single Page Application (SPA) combining Laravel 13, Inertia.js 3, and React 19, alongside a native Android APK build via Capacitor that bridges directly to Bluetooth Classic (SPP) thermal printers (BP-LITE80D) for instantaneous receipt printing without browser print dialogs. Manages multi-warehouse inventory, cashier shift reconciliation, and automated WhatsApp transaction dispatch.",
        keyFeatures: [
          "Native Android Bluetooth Classic (SPP) ESC/POS printing bridge eliminating print dialog delays (<0.5s auto-cut)",
          "Automated data sync with company ERP for end-of-day audit accuracy",
          "Multi-Warehouse Inventory Architecture tracking real-time stock mutations, transfers, and FEFO batch allocations",
          "Cashier Shift Lifecycle engine with cash float verification, drawer reconciliation, and detailed audit logs",
          "Cashier Payment Method Classification: Quick toggles (Cash, QRIS, Bank Transfer, Open-Bill) to categorize transactions for accurate end-of-shift reconciliation and finance administration",
          "Automated WhatsApp digital receipt and daily reporting microservice powered by Node.js and whatsapp-web.js",
          "Role-based access control via Spatie, password step-up verification, and login rate limiting",
        ],
        tags: [
          "Laravel",
          "Inertia.js",
          "React",
          "Capacitor",
          "Android",
          "Bluetooth ESC/POS",
          "Tailwind CSS",
          "MySQL",
          "Payment Classification",
        ],
        image: "assets/images/pos-checkout.png",
        fallbackImage: "assets/images/pos-dashboard.png",
        links: {
          docs: "docs/pos-system-documentation.html",
        },
        featured: true,
        order: 1,
      },
      {
        id: "twc-venue-booking",
        title: "TWC Multi-Destination Venue Booking & Scheduling Platform",
        subtitle:
          "Internal Enterprise Scheduling & Seating Layout System across Borobudur, Prambanan & Ratu Boko",
        category: "web",
        role: "IT Development and Data Management Intern",
        period: "2026",
        description:
          "Internal enterprise scheduling platform utilized by PT Taman Wisata Candi to coordinate multi-day venue bookings, load-in setup windows, and tiered seating layouts without double-booking conflicts.",
        overview:
          "Designed and developed an internal web enterprise platform for PT Taman Wisata Candi Borobudur, Prambanan & Ratu Boko (TWC / InJourney). The system coordinates high-capacity venue rentals across 3 premier heritage destinations (such as Lapangan Garuda, Trimurti Stage, and Ramayana Ballet stages). It features an atomic scheduling validation engine that accounts for multi-phase windows (load-in setup, main event, and tear-down unload) to eliminate scheduling collisions, coupled with an interactive seat allocation module and destination-scoped user permissions.",
        keyFeatures: [
          "Multi-phase conflict detection engine validating load-in, event, and tear-down windows before confirming bookings",
          "Dynamic Seating Chart Management (`kursi`) with row-and-column tier mapping for Ramayana Ballet Prambanan stages",
          "Destination-scoped Role-Based Access Control (Sales scoped to single sites; Admins manage cross-destination bookings)",
          "Comprehensive client history CRM, PIC assignment workflow, and per-user notification read-state tracking",
          "Modern, fast enterprise UI built with Laravel 13, Blade Components, Tailwind CSS 4, and Vite",
        ],
        tags: [
          "Laravel",
          "PHP",
          "Tailwind CSS",
          "MySQL",
          "Blade",
          "Vite",
          "Enterprise Scheduling",
          "TWC InJourney",
        ],
        image: "assets/images/venue-booking-bg.jpg",
        fallbackImage: "assets/images/venue-booking-logo.png",
        links: {
          docs: "docs/venue-booking-system-documentation.html",
        },
        featured: true,
        order: 2,
      },
      {
        id: "museum-prambanan",
        title: "Museum Candi Prambanan: Web Portal & Digital Catalog",
        subtitle:
          "Public Heritage Museum Platform & Historical Artifact Catalog",
        category: "web",
        role: "IT Development and Data Management Intern",
        period: "Aug 2026 - Present",
        description:
          "Official public web portal and digital museum catalog for Prambanan Temple Museum, featuring interactive archaeological artifact galleries, visitor counters, and a curator CMS dashboard.",
        overview:
          "Architected and built the official web portal for Museum Candi Prambanan (`museumprambanan.twc.id`) under PT Taman Wisata Candi. The platform provides tourists, archaeologists, and researchers with online access to historical stone inscriptions (such as Prasasti Siwagrha and Prasasti Klurak), temple relics, and catalog narratives. Includes a real-time visitor counter, curated educational exhibitions, and an administrative content management system for museum curators.",
        keyFeatures: [
          "Redesigned catalog interface for Prambanan's museum collection",
          "Public digital artifact & historical site (`situs`) catalog with high-resolution media galleries and historical annotations",
          "Live visitor tracking counter and engagement analytics module",
          "Curator CMS dashboard for managing educational collections, multimedia assets, and exhibition updates",
          "Mobile-first, accessible interface with optimized asset loading built on Laravel, Tailwind CSS, and Vite",
          "Deployed and running live in production at the official domain `museumprambanan.twc.id`",
        ],
        tags: [
          "Laravel",
          "Tailwind CSS",
          "PHP",
          "MySQL",
          "Vite",
          "Public Portal",
          "Cultural Heritage",
          "REST API",
        ],
        image: "assets/images/museum-hero.jpg",
        fallbackImage: "assets/images/museum-icon.png",
        links: {
          demo: "https://museumprambanan.twc.id",
          docs: "docs/museum-prambanan-documentation.html",
        },
        featured: true,
        order: 3,
      },
      {
        id: "injourney-ticketing-ai",
        title:
          "InJourney Destinations: AI Ticketing Assistant & Knowledge Base",
        subtitle:
          "Customer Support AI Agent & Curated Heritage Ticketing Knowledge Base",
        category: "ai",
        role: "AI & Knowledge Engineer · IT Development Intern",
        period: "2026",
        description:
          "AI customer support agent and domain knowledge base deployed on the official InJourney Destinations ticketing portal, resolving tourist inquiries on tariffs, bundling promos, visiting rules, and climb quotas.",
        overview:
          "Engineered and structured the domain Knowledge Base (KB) powering the customer support AI chatbot on ticket.injourneydestination.id (integrated via the Mekari Qontak omnichannel ecosystem). Formatted multi-destination ticketing rules, promotional bundles (such as Prambanan + Borobudur packages), temple monument climb quota guidelines (naik struktur Candi Borobudur), and visitor dress codes into verified grounding datasets. Designed system prompts, intent classification pathways, and conversational guardrails to answer tourist inquiries in Indonesian and English, and escalate ticketing disputes or refund requests to human ticketing officers with customer context.",
        keyFeatures: [
          "Curated Domain Knowledge Base: Structured unstructured ticketing policies, pricing tiers, and promotional bundling rules into verified grounding datasets",
          "AI Agent Prompt Engineering & Intent Resolution: Designed conversational paths, tone guidelines, and intent routing in Mekari Qontak for tourist queries in Indonesian and English",
          "Strict Hallucination Control & Guardrails: Bounded agent responses to verified Knowledge Base facts to prevent false ticketing or policy claims",
          "Human Handover Escalation Workflow: Automatically routes unresolved disputes, refunds, and payment inquiries to human ticketing staff with customer contact metadata",
          "Production Heritage Scale: Deployed on the primary ticketing gateway for UNESCO world heritage sites under PT Taman Wisata Candi / InJourney",
        ],
        tags: [
          "AI Agent",
          "Knowledge Base",
          "Mekari Qontak",
          "Customer Support",
          "Prompt Engineering",
          "InJourney",
          "TWC",
        ],
        image: "assets/images/ticket-chat-agent.jpg",
        fallbackImage: "assets/images/ticket-chat-agent.jpg",
        links: {
          demo: "https://ticket.injourneydestination.id",
          docs: "docs/injourney-ai-agent-documentation.html",
        },
        featured: true,
        order: 4,
      },
      {
        id: "thesis-yolov11-traffic",
        title:
          "Bandung Urban Traffic Density Estimation via YOLOv11 & DeepSORT",
        subtitle:
          "Computer Vision Research Defense at Telkom University (School of Computing)",
        category: "ai",
        role: "Lead Researcher & Computer Vision Engineer",
        period: "2025 - 2026",
        description:
          "Fine-tuned YOLOv11 and DeepSORT pipeline trained on 21,277 vehicle instances across 17 municipal CCTV locations (Pelindung Bandung) for real-time motorcycle and car density tracking with 98.1% counting accuracy.",
        overview:
          "Undergraduate research and engineering defense at Telkom University supervised by Dr. Edward Ferdian and Dr. Ema Rachmawati. Solved the critical limitation of conventional traffic detection models that fail in motorcycle-dominant Southeast Asian urban centers. Built an automated dataset extraction engine using Python + Selenium to sample 17 municipal CCTV feeds from Pelindung Bandung, annotated 1,515 frames across peak hours, applied directional flipping and grain injection augmentations, and fine-tuned YOLOv11 + DeepSORT. Achieved 65.5% mAP@50 (vs 12.1% baseline YOLOv11) with an 87.5x increase in motorcycle recall (70.0% vs 0.8%), reaching 98.1% real-world counting accuracy in light traffic and 85.0% in heavy congestion.",
        keyFeatures: [
          "Automated Municipal CCTV Pipeline: Custom Python + Selenium crawler extracting temporal frames every 10s from 17 Bandung Government CCTV locations",
          "Domain-Specific Dataset Curation: 1,515 annotated frames (21,277 vehicle instances; 62.5% motorcycles, 37.5% cars) with noise injection and horizontal flip augmentations",
          "YOLOv11 + DeepSORT Tracking Architecture: Bounded 640x640 real-time inference with Kalman filtering and appearance association across virtual counting lines",
          "87.5x Motorcycle Recall Surge: Reached 70.0% recall and 79.5% precision on test set, cutting baseline false negative rate from 99.2% to 30.0%",
          "Cross-City Generalization: Validated across 8 additional Bandung intersections (Gasibu, Pasteur, Jalaprang) and cross-city footage with 92.2% accuracy",
        ],
        tags: [
          "Computer Vision",
          "YOLOv11",
          "DeepSORT",
          "Python",
          "Selenium",
          "Roboflow",
          "PyTorch",
          "Telkom University",
        ],
        image: "assets/images/yolov11-traffic-hero.png",
        fallbackImage: "assets/images/yolov11-traffic-hero.png",
        links: {
          demo: "https://youtu.be/9cTdaF5clIw",
          drive:
            "https://drive.google.com/drive/folders/1uMvcc6kVqGnQQrBfZKppbOnqAGGQic4M?usp=sharing",
          docs: "docs/thesis-traffic-yolo-documentation.html",
          pdf: "docs/Andi_Ghafa_Thesis_Paper_ICOICT.pdf",
        },
        featured: true,
        order: 5,
      },
      {
        id: "aspire",
        title: "ASPIRE: Career & Course Recommendation Platform",
        subtitle: "AI-Powered Academic & Career Guidance System",
        category: "web",
        categories: ["web", "ai"],
        categoryLabel: "Full-Stack Web & AI",
        role: "Project Manager & Lead Full-Stack Developer",
        period: "2025 - 2026",
        description:
          "A web platform that parses student academic transcripts from PDF and uses an LLM pipeline to recommend career paths and relevant university electives.",
        overview:
          "ASPIRE was developed as a capstone team project addressing the disconnect between university curricula and real-world industry demands. As Project Manager and Full-Stack Lead alongside one developer, I architected the end-to-end pipeline: from PDF document ingestion and structured data extraction to prompting large language models for intelligent career gap analysis and course matching.",
        keyFeatures: [
          "Automated PDF transcript parser converting academic records into structured student profiles",
          "LLM integration providing contextual career trajectory matching and skill deficiency diagnostics",
          "Dynamic course planner recommending specific university electives mapped to target job roles",
          "Responsive, clean dashboard built with Next.js App Router and Tailwind CSS",
        ],
        tags: [
          "Next.js",
          "TypeScript",
          "MongoDB",
          "LLM Integration",
          "Tailwind CSS",
        ],
        image: "assets/images/aspire.png",
        fallbackImage: "porto2.png",
        links: {
          demo: "https://aspire-mu.vercel.app/",
          github: "https://github.com/BryanDhaniel/ASPIRE",
          docs: "docs/aspire-documentation.html",
          pdf: "porto 2.pdf",
        },
        featured: false,
        order: 6,
      },
      {
        id: "favehotel-app",
        title: "FaveHotel Laundry Logbook & Linen Inventory App",
        subtitle:
          "Production Web Application for Hotel Linen Operations & Batch Tracking",
        category: "web",
        categories: ["web", "mobile"],
        categoryLabel: "Production Web App",
        role: "Solo Developer & Software Engineering Intern",
        period: "Jul 2025 - Sep 2025",
        description:
          "Production web application built to digitize manual paper logbooks in hotel laundry operations, featuring real-time linen batch tracking, cloud spreadsheet synchronization, and Vercel cloud deployment.",
        overview:
          "During my industrial internship at FaveHotel Bogor, housekeeping and laundry staff relied on handwritten paper logbooks to track hundreds of daily linen movements (bedsheets, towels, pillowcases) between hotel floors and laundry facilities, leading to inventory discrepancies and delayed reports. I designed, engineered, and deployed the FaveHotel Laundry Logbook web application from scratch. Deployed live on Vercel, the app enables staff to record incoming/outgoing linen batches, track weights and counts, and synchronize records instantly to cloud spreadsheets with zero operational downtime.",
        keyFeatures: [
          "Direct linen batch recording: logs incoming/outgoing linens, unit weights, item classifications, and timestamped shift logs",
          "Instant bidirectional cloud synchronization with spreadsheets, cutting weekly management reporting time from 5 hours to instant",
          "Deployed on Vercel (favehotellaundrylogbook.vercel.app) with responsive web access for both desktop front-desk and tablet use",
          "Built with Flutter Web & Dart, optimized for rapid data entry with minimal network bandwidth overhead",
          "On-site staff onboarding and complete operational documentation delivered for hotel housekeeping operations",
        ],
        tags: [
          "Flutter Web",
          "Dart",
          "Spreadsheet API",
          "Vercel",
          "Operations",
          "Inventory Management",
        ],
        image: "assets/images/favehotel.jpg",
        fallbackImage: "porto.jpeg",
        links: {
          demo: "https://favehotellaundrylogbook.vercel.app/",
          docs: "docs/favehotel-app-documentation.html",
          pdf: "porto 1.pdf",
          drive:
            "https://drive.google.com/drive/folders/14KmCJALAOIj8jx7pWVYclDdgkDH3fQur?usp=sharing",
        },
        featured: false,
        order: 7,
      },
      {
        id: "library-system",
        title: "Console-Based Library Management System",
        subtitle: "Object-Oriented System with Role-Based Access Control",
        category: "system",
        role: "Coursework Project / Core Developer",
        period: "2024",
        description:
          "Console application implementing Object-Oriented Programming (OOP) principles and custom data structures for multi-role library cataloging, borrowing, and inventory management.",
        overview:
          "Built as an intensive academic project to demonstrate practical application of core OOP principles and memory-efficient data structures. Features dual-role permissions (Administrator and Guest), transaction ledger records, author-indexed search trees, and comprehensive input validation.",
        keyFeatures: [
          "Role-Based Access Control (RBAC) separating administrative stock control from guest search and borrowing",
          "Dynamic catalog searching indexed by author, ISBN, category, and availability",
          "Transaction tracking module with due-date calculation and return validation",
          "Input sanitization and exception handling to prevent runtime errors",
        ],
        tags: ["Java", "OOP", "Data Structures", "RBAC", "Console UI"],
        image: "assets/images/library.png",
        fallbackImage: "porto 3.png",
        links: {
          github:
            "https://github.com/andiZghafa/Console-Based-Library-Management-System",
          docs: "docs/library-system-documentation.html",
          pdf: "porto 3.pdf",
        },
        featured: false,
        order: 8,
      },
    ];
  }

  // --- RENDERING PROJECTS ---
  function splitProjects() {
    const featured = projects.filter((p) => p.featured);
    const lead = featured.length ? featured : projects.slice(0, FEATURED_FALLBACK_COUNT);
    const more = projects.filter((p) => !lead.includes(p));
    return { lead, more };
  }

  function renderProjects() {
    if (!projectsGrid) return;

    const { lead, more } = splitProjects();

    projectsGrid.innerHTML = lead
      .map((p, i) => createProjectCardHTML(p, i === 0))
      .join("");

    if (projectsMoreGrid && projectsAcc) {
      projectsMoreGrid.innerHTML = more
        .map((p) => createProjectCardHTML(p, false))
        .join("");
      projectsAcc.hidden = more.length === 0;
      const label = projectsAcc.querySelector(".more-toggle-label");
      const toggle = projectsAcc.querySelector(".t-acc-head");
      if (toggle && label) {
        toggle.dataset.closedLabel = `Show ${more.length} more project${more.length === 1 ? "" : "s"}`;
        toggle.dataset.openLabel = "Show fewer projects";
        label.textContent = toggle.dataset.closedLabel;
      }
    }

    // Open the details modal from a card click (links keep their own behavior)
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        openProjectModal(card.dataset.id);
      });
    });

    document.querySelectorAll("[data-open-modal]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openProjectModal(btn.dataset.openModal);
      });
    });
  }

  function createProjectCardHTML(p, isLead = false) {
    const categoryLabels = {
      web: "Full-Stack Web",
      mobile: "Mobile App",
      ai: "AI & Machine Learning",
      system: "Systems & OOP",
    };
    const catLabel =
      p.categoryLabel ||
      categoryLabels[p.category] ||
      p.category.toUpperCase();

    const imgSrc = p.image || p.fallbackImage || "assets/images/aspire.png";
    const fallbackSrc =
      p.fallbackImage || p.image || "assets/images/aspire.png";

    const tagsHTML = (p.tags || [])
      .slice(0, 3)
      .map(
        (tag) => `
      <span class="tech-chip">${escapeHTML(tag)}</span>
    `,
      )
      .join("");

    // Standardized Primary Action (Cognition Control)
    const links = p.links || {};
    const demoUrl = links.demo;
    const docsUrl =
      links.docs ||
      (links.manual && links.manual.endsWith(".html") ? links.manual : null);
    const pdfUrl =
      links.pdf ||
      (links.manual && links.manual.endsWith(".pdf") ? links.manual : null);
    const driveUrl = links.drive;

    let primaryActionHTML = "";
    if (demoUrl) {
      primaryActionHTML = `
        <a href="${escapeHTML(demoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-card-primary" title="Open Live Demo">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          <span>Live Demo</span>
        </a>
      `;
    } else if (docsUrl) {
      primaryActionHTML = `
        <a href="${escapeHTML(docsUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-card-primary" title="Read System Documentation">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <span>Documentation</span>
        </a>
      `;
    } else if (pdfUrl) {
      primaryActionHTML = `
        <a href="${escapeHTML(pdfUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-card-primary" title="View PDF Manual">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          <span>PDF Manual</span>
        </a>
      `;
    } else if (driveUrl) {
      primaryActionHTML = `
        <a href="${escapeHTML(driveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-card-primary" title="Open Google Drive">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
          <span>Drive</span>
        </a>
      `;
    }

    return `
      <article class="project-card${isLead ? " is-lead" : ""}" data-id="${p.id}" tabindex="0" role="region" aria-label="${escapeHTML(p.title)}">
        <div class="project-thumb-wrap">
          <img
            src="${escapeHTML(imgSrc)}"
            alt="${escapeHTML(p.title)}"
            class="project-thumb-img"
            loading="lazy"
            onerror="this.onerror=null; this.src='${escapeHTML(fallbackSrc)}';"
          />
        </div>
        <div class="project-content">
          <span class="category-tag">${catLabel}</span>
          <h3 class="project-title">${escapeHTML(p.title)}</h3>
          <p class="project-desc">${escapeHTML(p.description)}</p>
          <div class="tags-row">${tagsHTML}</div>
          <div class="project-actions-row">
            ${primaryActionHTML}
            <button class="btn-card-action btn-card-ghost btn-quick-view t-learn" data-open-modal="${p.id}">
              <span>Details</span>
              <span class="t-learn-chevron" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path class="t-learn-arm t-learn-arm-top" d="M6 4L10 8"/>
                  <path class="t-learn-arm t-learn-arm-bot" d="M10 8L6 12"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // --- PROJECT MODAL DRAWER ---
  function openProjectModal(id) {
    const p = projects.find((item) => item.id === id);
    if (!p || !projectModal || !modalContent) return;

    const imgSrc = p.image || p.fallbackImage || "assets/images/aspire.png";
    const fallbackSrc =
      p.fallbackImage || p.image || "assets/images/aspire.png";

    const featuresHTML =
      p.keyFeatures && p.keyFeatures.length > 0
        ? `
        <div style="margin-top: 20px;">
          <h4 style="font-family: var(--font-display); font-size: 15px; font-weight: 700; margin-bottom: 10px; color: var(--text-primary);">Key Architectural Highlights &amp; Features</h4>
          <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px; color: var(--text-secondary); font-size: 14.5px;">
            ${p.keyFeatures.map((f) => `<li>${escapeHTML(f)}</li>`).join("")}
          </ul>
        </div>
      `
        : "";

    const tagsHTML = (p.tags || [])
      .map(
        (t) =>
          `<span class="tech-chip" style="font-size: 12px; padding: 4px 10px;">${escapeHTML(t)}</span>`,
      )
      .join("");

    let actionButtonsHTML = "";
    const links = p.links || {};
    const demoUrl = links.demo;
    const docsUrl =
      links.docs ||
      (links.manual && links.manual.endsWith(".html") ? links.manual : null);
    const pdfUrl =
      links.pdf ||
      (links.manual && links.manual.endsWith(".pdf") ? links.manual : null);
    const driveUrl = links.drive;
    const githubUrl = links.github;

    if (demoUrl) {
      actionButtonsHTML += `
        <a href="${escapeHTML(demoUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 13.5px; padding: 9px 18px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Visit Live Demo
        </a>
      `;
    }
    if (docsUrl) {
      actionButtonsHTML += `
        <a href="${escapeHTML(docsUrl)}" target="_blank" rel="noopener noreferrer" class="btn ${demoUrl ? "btn-secondary" : "btn-primary"}" style="font-size: 13.5px; padding: 9px 18px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          System Documentation
        </a>
      `;
    }
    if (pdfUrl) {
      actionButtonsHTML += `
        <a href="${escapeHTML(pdfUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 13.5px; padding: 9px 18px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          View Manual (PDF)
        </a>
      `;
    }
    if (driveUrl) {
      actionButtonsHTML += `
        <a href="${escapeHTML(driveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 13.5px; padding: 9px 18px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
          View on Google Drive
        </a>
      `;
    }
    if (githubUrl) {
      actionButtonsHTML += `
        <a href="${escapeHTML(githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 13.5px; padding: 9px 18px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          Source Code
        </a>
      `;
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
        <span class="category-tag">${escapeHTML(p.categoryLabel ? p.categoryLabel.toUpperCase() : p.category.toUpperCase())}</span>
        <span style="font-family: var(--font-mono); font-size: 12.5px; color: var(--text-muted);">${escapeHTML(p.period || "")}</span>
      </div>
      <h2 style="font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
        ${escapeHTML(p.title)}
      </h2>
      ${p.role ? `<div style="font-size: 14.5px; font-weight: 600; color: var(--accent); margin-bottom: 16px;">${escapeHTML(p.role)}</div>` : ""}
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

    projectModal.classList.add("active");
    document.body.style.overflow = "hidden";
    modalCloseBtn.focus();
  }

  function closeProjectModal() {
    if (!projectModal || !projectModal.classList.contains("active")) return;
    projectModal.classList.add("closing");
    setTimeout(() => {
      projectModal.classList.remove("active", "closing");
      document.body.style.overflow = "";
    }, 150);
  }

  // --- TOAST MANAGER (Symmetric Smooth Transitions) ---
  function showToast(message, type = "success") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon =
      type === "success"
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

    toast.innerHTML = `${icon}<span>${escapeHTML(message)}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("toast-enter");
    });

    setTimeout(() => {
      toast.classList.remove("toast-enter");
      toast.classList.add("toast-exit");
      setTimeout(() => toast.remove(), 160);
    }, 2800);
  }

  // Helper: Escape HTML
  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- DISCLOSURES (transitions.dev accordion) ---
  function initAccordions() {
    document.querySelectorAll(".t-acc").forEach((acc) => {
      const head = acc.querySelector(".t-acc-head");
      const label = acc.querySelector(".more-toggle-label");
      const inner = acc.querySelector(".t-acc-panel-inner");
      if (!head) return;
      head.addEventListener("click", () => {
        const open = acc.getAttribute("data-open") === "true";
        acc.setAttribute("data-open", String(!open));
        head.setAttribute("aria-expanded", String(!open));
        // Collapsed content must not be reachable by keyboard or screen reader
        if (inner) inner.inert = open;
        if (label && head.dataset.closedLabel) {
          label.textContent = open
            ? head.dataset.closedLabel
            : head.dataset.openLabel;
        }
      });
    });
  }

  // --- HERO REVEAL (transitions.dev texts reveal, plays once) ---
  function initHeroReveal() {
    const hero = document.getElementById("heroReveal");
    if (!hero) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => hero.classList.add("is-shown"));
    });
  }

  // --- INITIALIZATION & EVENT LISTENERS ---
  function initEvents() {
    // Theme Switcher
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }

    // Modal Close
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeProjectModal);
    }
    if (projectModal) {
      projectModal.addEventListener("click", (e) => {
        if (e.target === projectModal) {
          closeProjectModal();
        }
      });
    }

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeProjectModal();
      }
      // Secret Developer / CMS Studio shortcut: Ctrl+Shift+A or Cmd+Shift+A
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "A" || e.key === "a")
      ) {
        e.preventDefault();
        window.location.href = "admin.html";
      }
    });

    // Copy Email to Clipboard with Tactile Icon & State Transition
    const copyEmailBtns = document.querySelectorAll("[data-copy-email]");
    copyEmailBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const email = btn.dataset.copyEmail || "ghafaat@gmail.com";
        const originalHTML = btn.innerHTML;

        navigator.clipboard
          .writeText(email)
          .then(() => {
            btn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: copyCheck 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;"><polyline points="20 6 9 17 4 12"/></svg>
            <span style="font-weight: 700;">Copied!</span>
          `;
            showToast(`Copied ${email} to clipboard!`, "success");
            setTimeout(() => {
              btn.innerHTML = originalHTML;
            }, 2000);
          })
          .catch(() => {
            showToast(`Contact: ${email}`, "info");
          });
      });
    });

    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  // Boot up
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initEvents();
    initAccordions();
    initHeroReveal();
    loadProjects();
  });

  // Expose global for potential CMS sync
  window.AndiPortfolio = {
    loadProjects,
    showToast,
    openProjectModal,
  };
})();

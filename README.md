# Andi Ziyadh Ghafa Ramadhan: Portfolio

Personal portfolio website documenting my work in enterprise software, web systems, computer vision, and mobile tools.

- **Live URL**: [https://andi-portofolio-one.vercel.app](https://andi-portofolio-one.vercel.app)
- **LinkedIn**: [linkedin.com/in/andighafa](https://www.linkedin.com/in/andighafa/)
- **Contact**: ghafaat@gmail.com

---

## Overview

I built this portfolio to document the systems I have engineered, ranging from enterprise production tools built during my role as **IT Development and Data Management Intern** at PT Taman Wisata Candi (TWC / InJourney) to academic research and mobile tools.

The site is built with vanilla HTML5, CSS3, and JavaScript: no bulky framework builds, instant load times, clean keyboard accessibility, and full mobile responsiveness.

### Featured Projects

1. **Prambanan & Ratu Boko Enterprise POS**: Full-stack web and POS cashier system built with Laravel 13, React 19, and Inertia.js, deployed across ticketing and merchant counters in Candi Prambanan and Keraton Ratu Boko. Connects with company ERP, handles multi-warehouse stock mutations, and prints directly to Bluetooth Classic ESC/POS thermal printers via a native Capacitor Android bridge.
2. **TWC Multi-Destination Venue Booking Platform**: Enterprise scheduling platform built for PT Taman Wisata Candi to coordinate multi-day venue rentals, setup load-in windows, and tiered seating layouts without double-booking collisions.
3. **Museum Candi Prambanan Web Portal**: Official website (`museumprambanan.twc.id`) featuring archaeological artifact galleries, live visitor tracking, and a curator CMS dashboard.
4. **InJourney Destinations AI Ticketing Assistant & Knowledge Base**: Domain knowledge base and prompt guardrails powering the customer support AI chatbot deployed on `ticket.injourneydestination.id` via Mekari Qontak.
5. **Bandung Urban Traffic Density Estimation via YOLOv11 & DeepSORT**: Undergraduate research defense at Telkom University. Solved motorcycle detection failure in Southeast Asian traffic, reaching 65.5% mAP@50 and 98.1% field counting accuracy across 17 Bandung CCTV feeds. Published in ICOICT 2026.
6. **ASPIRE Career & Course Platform**: Full-stack web application built with Next.js, TypeScript, and MongoDB that parses student transcripts from PDF and uses an LLM pipeline to recommend personalized career paths and university electives.
7. **FaveHotel Laundry Logbook & Linen Inventory App**: Web and mobile application built with Flutter (deployed at [favehotellaundrylogbook.vercel.app](https://favehotellaundrylogbook.vercel.app/)) with QR code scanning to replace paper records during hotel linen processing, syncing directly with cloud spreadsheets.
8. **Console-Based Library Management System**: Java console application implementing core OOP principles, custom data structures, role-based access control, and transaction ledgers.

---

## Technical Documentation

Every project includes a dedicated technical documentation page under `docs/` detailing real system architecture, constraints, database schemas, and workflows:

- `docs/pos-system-documentation.html`: Architecture, Bluetooth SPP bridge, multi-warehouse schema, shift reconciliation.
- `docs/venue-booking-system-documentation.html`: Multi-phase atomic booking validation, seating tiers, role permissions.
- `docs/museum-prambanan-documentation.html`: Laravel and Vite architecture, artifact catalog, curator CMS.
- `docs/injourney-ai-agent-documentation.html`: Knowledge Base grounding, intent trees, hallucination guardrails, human handover.
- `docs/thesis-traffic-yolo-documentation.html`: Municipal CCTV crawler, dataset curation, YOLOv11 and DeepSORT metrics, confusion matrix.
- `docs/aspire-documentation.html`: Next.js App Router, PDF parsing engine, prompt orchestration.
- `docs/favehotel-app-documentation.html`: Flutter architecture, camera QR scanner, Google Sheets sync, operational impact.
- `docs/library-system-documentation.html`: Java OOP design patterns, RBAC, BST indexing, transaction validation.

---

## Project Manager (CMS Studio)

To update portfolio items or descriptions without editing HTML tags by hand, the site includes a structured data layer (`data/projects.json`) paired with an admin panel (`admin.html`).

### 1. Local Server Mode (Direct Disk Save)

When running locally with Node:

```bash
npm start
# or: node server.js
```

Open `http://localhost:3000/admin.html` (or press `Ctrl` + `Shift` + `A` on the main page). Any edits or new project additions save directly to `data/projects.json` on disk, and uploaded screenshots go to `assets/images/`.

### 2. Static / Direct Browser Mode

If opened directly in a browser without Node running:

- Open `admin.html`
- Edit or add project records and click **Save** (updates browser session)
- Click **Export JSON** to download the updated `projects.json`
- Replace `data/projects.json` in your local folder and push to Git.

---

## File Structure

```text
.
├── index.html            # Main portfolio page
├── admin.html            # Project manager interface (CMS Studio)
├── server.js             # Zero-dependency local Node server for disk saves
├── package.json          # npm start / dev scripts
├── data/
│   └── projects.json     # Project data source
├── css/
│   └── style.css         # Design system: Navy, Cream, and Coral palette
├── js/
│   └── app.js            # Card rendering, filtering, search, and detail modal
├── docs/                 # Complete technical documentation pages
│   ├── pos-system-documentation.html
│   ├── venue-booking-system-documentation.html
│   ├── museum-prambanan-documentation.html
│   ├── injourney-ai-agent-documentation.html
│   ├── thesis-traffic-yolo-documentation.html
│   ├── aspire-documentation.html
│   ├── favehotel-app-documentation.html
│   ├── library-system-documentation.html
│   └── Andi_Ghafa_Thesis_Paper_ICOICT.pdf
├── assets/
│   └── images/           # Screenshots and project visuals
└── Andi_Ghafa_CV.pdf     # Resume
```

---

## Running Locally

No npm dependencies required:

- **Quick view**: Double-click `index.html` in any browser, or use VS Code's Live Server.
- **With local CMS server**: Run `npm start` and open `http://localhost:3000`.

---

## Deployment

The site is fully static:

- **GitHub Pages**: Push to `main`, go to **Settings** > **Pages**, select `main` branch root, and save.
- **Vercel / Netlify**: Import the repository with zero build command and `./` root directory.

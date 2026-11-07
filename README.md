# Andi Ziyadh Ghafa Ramadhan — Portfolio

Personal portfolio website showcasing my work in enterprise software, web applications, and mobile systems.

- **Live URL**: [https://andi-portofolio-one.vercel.app](https://andi-portofolio-one.vercel.app)
- **LinkedIn**: [linkedin.com/in/andighafa](https://www.linkedin.com/in/andighafa/)
- **Contact**: ghafaat@gmail.com

---

## Overview

I built this portfolio to document and present the systems I've worked on, ranging from enterprise production tools at PT Taman Wisata Candi (TWC / InJourney) to academic and freelance projects. 

Instead of heavy frontend frameworks that require multi-gigabyte build chains, this site is built with vanilla HTML5, CSS3, and JavaScript. It loads instantly, works offline, and renders smoothly on mobile and desktop.

### Featured Projects

1. **Prambanan & Ratu Boko Enterprise POS**: Cashier point-of-sale system deployed across ticketing counters in Candi Prambanan and Candi Ratu Boko. Integrates with the company ERP, handles multi-warehouse stock mutations, and connects directly to Bluetooth Classic thermal printers via a Capacitor Android bridge.
2. **TWC Venue Booking Platform**: Multi-destination scheduling system built for PT Taman Wisata Candi to manage venue reservations, setup load-in windows, and Ramayana Ballet seating tiers without double-booking collisions.
3. **Museum Candi Prambanan Web Portal**: Official website (`museumprambanan.twc.id`) featuring archaeological artifact galleries, visitor tracking, and a curator CMS dashboard.
4. **ASPIRE Career & Course Platform**: Next.js and MongoDB web application that parses student transcripts and recommends tailored electives and career paths.
5. **FaveHotel Laundry App**: Flutter mobile logbook with QR code scanning to replace paper records during hotel linen processing.
6. **Library Management System**: Object-oriented console system demonstrating custom data structures, transaction tracking, and role-based access control.

---

## Built-in Project Manager (CMS Studio)

To make it easy to add new portfolio cards or update descriptions without editing HTML tags by hand, the site uses a structured data layer (`data/projects.json`) paired with a lightweight admin panel (`admin.html`).

There are two ways to use it:

### 1. Local Server Mode (Direct Disk Save)
When running locally with Node:

```bash
npm start
# or: node server.js
```

Open `http://localhost:3000/admin.html` (or press `Ctrl` + `Shift` + `A` on the main page). Any edits or new project additions save directly to `data/projects.json` on disk, and uploaded screenshots go straight to `assets/images/`.

### 2. Static / GitHub Pages Mode
If opened directly in a browser without Node running:
- Open `admin.html`
- Fill in the project fields and click **Save** (it updates the browser session)
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
│   └── style.css         # Typography, responsive layout, Navy/Cream/Coral themes
├── js/
│   └── app.js            # Card rendering, filtering, search, and detail modal
├── docs/
│   ├── pos-system-documentation.html           # Technical manual for POS system
│   └── venue-booking-system-documentation.html # Technical manual for Venue Booking
├── assets/
│   └── images/           # Screenshots and project visuals
└── Andi_Ghafa_CV.pdf     # Resume
```

---

## Running Locally

You don't need any npm dependencies to run this site:

- **Quick view**: Double-click `index.html` in any browser, or use VS Code's Live Server.
- **With local CMS server**: Run `npm start` and visit `http://localhost:3000`.

---

## Deployment

The site is fully static and can be deployed anywhere:

### GitHub Pages
1. Push the repository to GitHub:
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```
2. In your repo on GitHub, go to **Settings** &rarr; **Pages**, set branch to `main`, and save.

### Vercel / Netlify
Import the repository. No build command is required, output directory is `./`.

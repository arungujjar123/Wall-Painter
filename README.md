# 🎨 Smart Wall Paint Visualizer

> **A Production-Grade MEAN Stack Virtual Room Paint & Design Preview Application.**
> Developed for **Unified Mentor** Capstone Evaluation.
> Inspired by the [Behr Paint Visualizer](https://www.behr.com/consumer/colors/paint).

[![MEAN Stack](https://img.shields.io/badge/Stack-MEAN-green.svg)](https://en.wikipedia.org/wiki/MEAN_(solution_stack))
[![Angular](https://img.shields.io/badge/Angular-17.x-dd0031.svg?logo=angular)](https://angular.io)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933.svg?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000.svg?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248.svg?logo=mongodb)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Executive Summary & Problem Statement

Choosing the right paint color is one of the most critical and expensive interior design decisions for homeowners. Customers traditionally rely on tiny shade swatches or sterile showroom displays which fail to reflect **real-world room lighting, reflections, and room geometry**. Consequently, wrong paint choices cause widespread customer dissatisfaction and substantial repainting expenses.

**Smart Wall Paint Visualizer** is a web application enabling users to:
1. Upload real photos of their own living rooms, bedrooms, kitchens, or facades.
2. Outline specific walls using an interactive **HTML5 Canvas polygon selection engine**.
3. Virtually simulate **50+ catalogued paint shades** from manufacturers such as *Asian Paints, Dulux, Berger, and Nerolac*.
4. Adjust translucent opacity and surface finishes (*Matte, Eggshell, Satin, Gloss*).
5. Compare instantaneous **Before vs. After** previews with a single click.
6. Export high-resolution rendered PNG images and save design portfolios with JWT-secured MongoDB accounts.

---

## 🏗️ Architecture & Technology Stack

```
                          ┌────────────────────────┐
                          │   Angular 17 Client    │
                          │ (HTML5 Canvas / SCSS)  │
                          └───────────┬────────────┘
                                      │ REST APIs / JWT
                                      ▼
                          ┌────────────────────────┐
                          │   Express.js Server    │
                          │  (Multer / Sharp / V8) │
                          └───────────┬────────────┘
                                      │ Mongoose ODM
                                      ▼
                          ┌────────────────────────┐
                          │   MongoDB Database     │
                          │(Users, Projects, Colors│
                          └────────────────────────┘
```

### Frontend (`client/`)
- **Angular 17+** with Standalone Components & New Control Flow (`@if`, `@for`).
- **HTML5 Canvas 2D API** for real-time polygon boundary drawing, vertex snapping, and translucent color blending.
- **Modern SCSS Design System**: Dark-mode architectural theme with responsive layout.
- **Functional Interceptors & Route Guards** for stateless JWT authorization.

### Backend (`server/`)
- **Node.js 20+ & Express.js**: RESTful micro-architecture with robust input validation.
- **MongoDB & Mongoose**: Schemas for Users, Colors, Patterns, and Room Projects.
- **Multer & Sharp**: Image processing, uploads storage, and automated thumbnail creation.
- **JWT & BCrypt**: Cryptographic password hashing and bearer token verification.

---

## 🚀 Key Functional Features

| Category | Feature | Description |
|---|---|---|
| **Canvas Engine** | **Polygon Boundary Tool** | Click anywhere on the room photo to place boundary vertices; automatically snaps to close and isolate wall surfaces. |
| **Color Studio** | **50+ Catalogued Shades** | Pre-seeded with designer shades categorized into Living Room, Bedroom, Accent, Exterior, and Kids rooms. |
| **Custom Palette** | **Native HEX Picker** | Pick any arbitrary HEX code for custom interior schemes. |
| **Finish Simulator** | **Opacity & Reflection** | Fine-tune paint opacity from 10% to 95% and toggle Matte, Eggshell, Satin, and Gloss modes. |
| **Comparison** | **Before / After Preview** | Hold the *Hold for Original* button to instantaneously toggle between raw room and virtual paint. |
| **Multi-Wall** | **Dual-Tone Styling** | Style multiple independent walls in a single room with contrasting accent colors. |
| **Export** | **High-Res PNG** | Export client-side canvas render directly as an image file. |
| **Admin Panel** | **Palette & User Control** | Dashboard for system KPIs, adding new manufacturer paint codes, and adjusting user access. |

---

## 📁 Repository Structure

```
wall-painter/
├── client/                      # Angular 17 Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/            # Models, Services, Guards, Interceptors
│   │   │   │   ├── guards/      # auth.guard.ts, admin.guard.ts
│   │   │   │   ├── interceptors/# auth.interceptor.ts
│   │   │   │   ├── models/      # color, project, user interfaces
│   │   │   │   └── services/    # auth, color, project, admin services
│   │   │   ├── features/
│   │   │   │   ├── auth/        # Login & Register views
│   │   │   │   ├── dashboard/   # User saved rooms dashboard
│   │   │   │   ├── visualizer/  # HTML5 Canvas wall painting engine
│   │   │   │   ├── gallery/     # Community inspiration showcase
│   │   │   │   └── admin/       # Admin KPIs, colors, user tables
│   │   │   ├── shared/          # Navbar, Footer, ColorSwatch components
│   │   │   ├── app.routes.ts    # Application routing definitions
│   │   │   └── app.config.ts    # Application provider configuration
│   │   ├── styles.scss          # Architectural Dark Theme CSS system
│   │   └── index.html           # Typography & Bootstrap Icons CDN
│   └── angular.json
├── server/                      # Node.js Express Backend
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── controllers/         # Auth, Color, Project, Admin controllers
│   │   ├── middleware/          # JWT auth, Multer upload, Error handler
│   │   ├── models/              # User, Color, Pattern, Project Mongoose schemas
│   │   ├── routes/              # Express API endpoints
│   │   ├── seeds/               # 50+ shades & admin account seed script
│   │   └── server.js            # Express server entrypoint
│   ├── uploads/                 # Storage for room photos & thumbnails
│   └── package.json
├── package.json                 # Workspace root scripts
├── .gitignore                   # Universal git exclusions
└── README.md                    # Project documentation
```

---

## ⚙️ Quick Start Installation

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or v20 LTS)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017`

### 1. Clone the repository
```bash
git clone https://github.com/your-username/wall-paint-visualizer.git
cd wall-paint-visualizer
```

### 2. Install Dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd server && npm install

# Frontend dependencies
cd ../client && npm install
```

### 3. Seed Database with 50+ Colors & Default Accounts
```bash
cd ../server
npm run seed
```
> This populates MongoDB with 50 realistic designer shades and initializes two ready-to-use accounts:
> - **Admin Account**: `admin@wallpaint.com` / `admin123`
> - **User Account**: `user@wallpaint.com` / `user123`

### 4. Start Development Servers
From the root directory:
```bash
npm run dev
```
Or start them individually in separate terminals:
```bash
# Terminal 1: Backend Server (runs on http://localhost:5000)
cd server && npm run dev

# Terminal 2: Frontend Client (runs on http://localhost:4200)
cd client && npm start
```

Open your browser at **`http://localhost:4200`**.

---

## 🔐 Default Demo Accounts

| Role | Email | Password | Privileges |
|---|---|---|---|
| **Admin** | `admin@wallpaint.com` | `admin123` | Full access to Admin Dashboard, Color CRUD, and User Management. |
| **Demo User** | `user@wallpaint.com` | `user123` | Access to Visualizer, saving designs, project management. |

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System health check and uptime. |
| `POST` | `/api/auth/register` | Public | Register new user account. |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT token. |
| `GET` | `/api/auth/profile` | Protected | Fetch current user account info. |
| `GET` | `/api/colors` | Public | List colors with category & brand filter. |
| `POST` | `/api/colors` | Admin | Create new color shade. |
| `DELETE` | `/api/colors/:id` | Admin | Soft delete color shade. |
| `GET` | `/api/projects/public` | Public | Community inspiration gallery. |
| `POST` | `/api/projects` | Protected | Upload room photo and create project. |
| `PUT` | `/api/projects/:id/design` | Protected | Save base64 rendered painted image & wall points. |
| `GET` | `/api/admin/dashboard` | Admin | Aggregate KPIs (Users, Projects, Colors). |
| `GET` | `/api/admin/users` | Admin | User listing and role modification. |

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

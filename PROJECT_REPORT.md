# 📄 SMART WALL PAINT VISUALIZER — PROJECT REPORT

---

## 📌 PROJECT METADATA

- **Project Title:** Smart Wall Paint Visualizer
- **Domain:** Web Application / Computer Vision & Interactive Canvas / PropTech & Interior Design
- **Technology Stack:** MEAN Stack (MongoDB, Express.js, Angular 17, Node.js) + HTML5 Canvas API
- **Developer / Author:** Arun Gujjar
- **GitHub Repository:** [https://github.com/arungujjar123/Wall-Painter](https://github.com/arungujjar123/Wall-Painter)
- **Live Cloud Deployment:** [https://wall-painter-qmfe.onrender.com/](https://wall-painter-qmfe.onrender.com/)
- **Organization / Mentor Reference:** Unified Mentor Capstone Project
- **Industry Reference:** Behr Paint Visualizer, Asian Paints Colour Visualizer

---

## 1. ABSTRACT & EXECUTIVE SUMMARY

Choosing interior and exterior wall paint colors is one of the most critical and irreversible home improvement decisions for property owners, architects, and paint contractors. In traditional retail workflows, consumers rely on paper swatch cards or showroom displays. These methods consistently fail to reflect how real-world room geometry, natural daylight, artificial indoor lighting, and shadowing alter paint perception. Consequently, millions of homeowners face post-painting dissatisfaction, leading to significant financial losses and costly repainting cycles.

**Smart Wall Paint Visualizer** is a production-grade web application built on the modern **MEAN stack (MongoDB Atlas, Express.js, Angular 17 Standalone, Node.js)** that solves this problem. The application empowers users to upload real photos of their rooms, trace wall segments with an interactive **HTML5 Canvas Polygon Selection Engine**, and realistically simulate over **50+ catalogued paint shades** across various manufacturers (*Asian Paints, Dulux, Berger, Nerolac, Nippon Paint*) in real time. Features include customizable finish simulations (*Matte, Eggshell, Satin, Gloss*), blending opacity controls, dual-tone multi-wall segmentation, instant **Before vs. After** comparisons, high-resolution PNG rendering, and cloud portfolio management with JWT authorization.

---

## 2. PROBLEM STATEMENT & OBJECTIVES

### 2.1 The Problem
1. **Perception vs. Reality Gap:** Paper shade cards cannot demonstrate how sunlight, room size, and warm/cool lightbulbs affect color undertones.
2. **High Repainting Cost:** Choosing the wrong shade costs thousands of rupees in wasted paint cans and manual labor.
3. **Lack of Accessible Digital Tools:** Most existing commercial visualizers are gated behind expensive proprietary contractor suites or lack responsive web access.

### 2.2 Primary Objectives
- Enable real-time paint visualization on user-uploaded room photos.
- Provide a smooth, polygon-based wall selection mechanism without requiring complex desktop graphic editors.
- Build an accurate, translucent color-blending engine supporting multiple surface finishes.
- Deliver instantaneous Before & After comparisons with single-click PNG exports.

### 2.3 Secondary Objectives
- Enable interior designers and painters to showcase design variations during client consultations.
- Implement role-based access control (RBAC) with an **Admin Management Dashboard** for managing paint catalogs and user accounts.
- Deploy the complete application onto high-availability cloud infrastructure with a global cloud database.

---

## 3. SYSTEM ARCHITECTURE & DATA FLOW

```
+-------------------------------------------------------------------------+
|                           CLIENT TIER (Angular 17)                      |
|                                                                         |
|  +--------------------+   +-----------------------+   +---------------+ |
|  |  HTML5 Canvas 2D   |   |   Color Studio &      |   |  Auth & User  | |
|  |  Polygon Engine    |   |   Finish Simulator    |   |  Portfolios   | |
|  +---------+----------+   +-----------+-----------+   +-------+-------+ |
+------------|--------------------------|-----------------------|---------+
             |                          |                       |
             | REST APIs / JSON / JWT   | Bearer Tokens         | Multipart
             v                          v                       v
+-------------------------------------------------------------------------+
|                           SERVER TIER (Node.js & Express)               |
|                                                                         |
|  +------------------+   +----------------------+   +------------------+ |
|  | Auth Middleware  |   | Project & Color      |   | Multer & Sharp   | |
|  | (JWT Validation) |   | Controllers          |   | Image Processing | |
|  +--------+---------+   +----------+-----------+   +--------+---------+ |
+-----------|------------------------|------------------------|-----------+
            |                        |                        |
            | Mongoose ODM           v                        v
+-----------|-------------------------------------------------------------+
|           v              DATABASE TIER (MongoDB Atlas)                  |
|                                                                         |
|  [Users Collection]     [Colors Collection]     [Projects Collection]   |
+-------------------------------------------------------------------------+
```

### Flow of Execution:
1. **User Authentication:** Stateless JWT issuance with bcrypt password hashing.
2. **Room Upload / Sample Load:** Uploads are processed via Multer, resized with Sharp for high-speed thumbnails, and rendered onto the Canvas.
3. **Polygon Wall Mapping:** Client captures coordinates `(x, y)` on mouse clicks. When the user clicks near the origin vertex, the loop closes into a wall zone.
4. **Color & Finish Synthesis:** The canvas fills the segmented polygon using composite operations, adjustable alpha opacity (10% to 95%), and finish specular simulation.
5. **Storage & Cloud Sync:** Designs are exported to Base64/PNG and persisted to MongoDB Atlas.

---

## 4. DATABASE SCHEMAS & DATA MODELS

### 4.1 User Schema (`server/src/models/User.js`)
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // BCrypt hashed
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String },
  favouriteColors: [{ type: ObjectId, ref: 'Color' }],
  createdAt: { type: Date, default: Date.now }
}
```

### 4.2 Color Schema (`server/src/models/Color.js`)
```javascript
{
  name: { type: String, required: true },
  hex: { type: String, required: true },
  rgb: { r: Number, g: Number, b: Number },
  brand: { type: String, required: true }, // Asian Paints, Dulux, Berger, etc.
  finish: { type: String, enum: ['matte', 'satin', 'semi-gloss', 'gloss', 'eggshell'] },
  category: [{ type: String }], // Living Room, Bedroom, Accent, Exterior, etc.
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

### 4.3 Project Schema (`server/src/models/Project.js`)
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Untitled Project' },
  originalImage: { type: String, required: true },
  thumbnail: { type: String },
  wallSelections: [{
    points: [{ x: Number, y: Number }],
    colorHex: String,
    colorId: { type: ObjectId, ref: 'Color' },
    opacity: Number,
    finish: String
  }],
  paintedImage: { type: String }, // Rendered Base64 PNG
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 5. KEY MODULES & TECHNICAL IMPLEMENTATION

### 5.1 Interactive HTML5 Canvas Polygon Engine
- **Coordinate Transformation:** Accurately converts viewport mouse clicks to native image canvas resolutions (`scaleX`, `scaleY`), ensuring high-resolution accuracy regardless of screen zoom.
- **Auto-Snapping & Closure:** Automatically detects when a vertex is placed within 20px of the starting vertex to snap and seal the polygon wall boundary.
- **Dual-Tone Multi-Wall Support:** Multiple walls can be drawn independently on the same room image, each maintaining its own color, opacity, and finish attributes.

### 5.2 Realistic Color & Finish Synthesis
- **Alpha Blending:** Allows underlying architectural textures, brick grain, moulding lines, and ambient lighting to penetrate the paint layer.
- **Finish Modes:**
  - **Matte:** Pure diffuse light absorption with zero specular sheen.
  - **Eggshell / Satin:** Moderate balanced reflection suited for living spaces.
  - **Gloss:** Uses canvas `screen` blend mode overlay to simulate high-shine reflective lacquer.

### 5.3 Instant Before / After Comparison
- **One-Touch Toggle:** Holding down the **"Hold for Original"** button bypasses the paint overlay loop, rendering the raw image instantaneously for comparison.

### 5.4 Administrative Dashboard & Content Management
- **Dashboard KPIs:** Real-time counting of registered users, saved projects, active colors, and wallpaper patterns.
- **Color Catalog CRUD:** Admins can insert custom HEX colors, assign manufacturer brands, select finishes, and categorize rooms.
- **User Role Management:** Admins can promote/demote user privileges and monitor activity feeds.

---

## 6. SECURITY & NON-FUNCTIONAL REQUIREMENTS

- **Stateless JWT Authorization:** Tokens are passed in HTTP `Authorization: Bearer <token>` headers with expiration policies.
- **Password Protection:** Cryptographic salting with `bcryptjs` (salt rounds: 10).
- **CORS Protection:** Configured cross-origin resource sharing supporting production cloud domains.
- **Responsive Architecture:** Fully optimized across desktop workstations, laptops, and tablets.
- **Clean Angular Architecture:** Standalone components with modern Angular control-flow syntax (`@if`, `@for`, `@else`).

---

## 7. DEPLOYMENT & PRODUCTION INFRASTRUCTURE

| Component | Platform | Configuration |
|---|---|---|
| **Database** | **MongoDB Atlas** (M0 Cloud Cluster) | Multi-region replica set, automated indexes, 24/7 uptime |
| **Backend & Frontend** | **Render.com** (Linux Cloud Web Service) | Unified production build, automatic CI/CD from GitHub `main` |
| **Source Control** | **GitHub** | Semantic versioning, structured commits, branch management |

- **Live URL:** [https://wall-painter-qmfe.onrender.com/](https://wall-painter-qmfe.onrender.com/)
- **API Health Check:** [https://wall-painter-qmfe.onrender.com/api/health](https://wall-painter-qmfe.onrender.com/api/health)

---

## 8. TEST ACCOUNTS (FOR DEMO & EVALUATION)

| Account Type | Email | Password | Access Rights |
|---|---|---|---|
| **Administrator** | `admin@wallpaint.com` | `admin123` | Full Admin Dashboard, Color CRUD, User Management |
| **Standard User** | `user@wallpaint.com` | `user123` | Canvas Visualizer, Save Projects, Gallery Remix |

---

## 9. CONCLUSION & FUTURE SCOPE

The **Smart Wall Paint Visualizer** successfully delivers a professional, accessible, and realistic interior paint simulation experience on the web. By bridging the gap between paper shade cards and real room lighting, it empowers homeowners to make informed design choices, reduces repainting costs, and provides contractors with a consultation tool.

### Future Enhancements (Phase 2 Roadmap):
1. **AI Automated Wall Detection:** Deep learning image segmentation (Mask R-CNN / Segment Anything Model) to detect wall boundaries automatically with a single tap.
2. **Augmented Reality (AR) Live Mode:** Real-time mobile camera projection using WebXR.
3. **E-Commerce Paint Integration:** Direct paint can ordering and volume estimation calculator (square footage to liters required).

---
*Report generated for Unified Mentor Capstone Project & Evaluation.*

# ♻️ Reviwa – Smart Waste Management & Clean City Platform

**Reviwa** is a MERN-stack web application designed to make urban waste management smarter, more transparent, and community-driven.
The platform empowers citizens to **report waste sites**, **track cleanup progress**, and **earn eco-points** for verified contributions — creating cleaner, safer, and more sustainable cities.

---

## 🔗 Links

- **🌐 Live Demo:** [https://reviwa.netlify.app/](https://reviwa.netlify.app/)
- **📊 Pitch Deck:** [REVIWA - Reviving Cities, One Report at a Time](https://gamma.app/docs/REVIWA-Reviving-Cities-One-Report-at-a-Time-71g1khnubjgsaf0)

---

## 🌍 SDG Alignment

**Primary Goal:**
🟢 **SDG 11 – Sustainable Cities and Communities**

> Make cities inclusive, safe, resilient, and sustainable.

**Supporting Goals:**

- **SDG 12 – Responsible Consumption and Production**
- **SDG 13 – Climate Action**

---

## 💡 Problem Statement

Urban areas across developing nations face rising challenges in **waste collection, disposal, and community awareness**.
Overflowing dumpsites, illegal waste burning, and uncoordinated cleanup efforts threaten both the environment and public health.

**Reviwa** bridges the gap between **citizens, city councils, and environmental NGOs** — using technology to enable real-time reporting, monitoring, and collaboration.

---

## 🚀 Project Scope (MVP)

The MVP focuses on waste reporting and community engagement.

### Core Features

- 🗑️ **Report Waste Sites:** Upload photos (up to 5 images with auto-compression), add description, and mark location
- 📍 **Geolocation Tracking:** Browser-based GPS to identify exact dump sites
- 🗺️ **Interactive Map:** Visualize all waste reports on an interactive map with color-coded markers and clustering
- 📊 **User Dashboard:** Track your reports, eco-points, and community impact
- ⭐ **Eco-Points System:** Earn points for verified cleanup actions (10 points per report, 20 for verification, 50 for resolution)
- 👤 **User Profiles:** View account details and environmental impact stats
- 🏅 **Leaderboard:** Top contributors ranked by eco-points (admins excluded from competition)
- **Email Notifications:** Automated emails for welcome, status updates, milestones, and admin alerts
- 🛡️ **Admin Dashboard:** Comprehensive admin control panel with role-based access
  - Overview stats (users, reports, status breakdown)
  - User management (view, promote/demote roles)
  - Report management with admin notes system
  - Admin-only report status updates
- 📝 **Admin Notes:** Internal notes system for tracking report investigations
- 🔐 **Secure Authentication:** JWT-based auth with protected routes and role-based access control
- 🔄 **Report Management:** View, update status (admin-only), and delete reports
- 📱 **Mobile Responsive:** Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Real-time Updates:** Dynamic data fetching with loading states
- 🎨 **Modern UI/UX:** Glassmorphism effects, smooth Framer Motion animations, emerald/purple color scheme
- 🔍 **Advanced Filters:** Filter reports by status, waste type, and severity

---

## 🧠 Technology Stack

| Layer               | Technology                                     |
| ------------------- | ---------------------------------------------- |
| **Frontend**        | React 18.3.1, Vite 6.0.1, Tailwind CSS 3.4     |
| **Backend**         | Node.js, Express 4.19.2, ES6 Modules           |
| **Database**        | MongoDB 8.3.0 (Atlas) with Geospatial Indexing |
| **Auth**            | JWT (bcryptjs, jsonwebtoken)                   |
| **File Storage**    | Cloudinary (image uploads & optimization)      |
| **Email**           | Nodemailer 7.0.10 with Gmail SMTP              |
| **Maps**            | React Leaflet 4.x, Leaflet, OpenStreetMap      |
| **UI/Animations**   | Framer Motion 11.11, Heroicons 2.2             |
| **API Client**      | Axios 1.7.7                                    |
| **Hosting**         | Netlify (client) + Render (server)             |
| **Version Control** | Git & GitHub                                   |

---

## 📈 Market Analysis

- **Global Smart Waste Management Market:** Expected to reach **$5.5 billion by 2027** (Allied Market Research, 2024).
- **African Urban Waste Projection:** Expected to **triple by 2050** (World Bank).
- **Opportunity:** No dominant citizen-centered waste tracking platform currently exists in most African cities.

### Target Users

- Urban residents (citizens, youth, environmental activists)
- Municipal waste management authorities
- Environmental NGOs and CSR partners

---

## 💰 Monetization Model

| Revenue Stream             | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| **Municipal Partnerships** | Subscription model for cities to use Reviwa dashboards.       |
| **CSR Sponsorships**       | Corporate partners fund cleanup drives & user rewards.        |
| **Data Analytics Access**  | Insights sold to NGOs & policy institutions.                  |
| **Gamified Rewards**       | Points redeemable via partner brands (eco products, airtime). |

---

## 🧬 Repository Structure

```
reviwa/
├── client/              # React 18.3 frontend (Vite + Tailwind)
│   ├── public/          # Static assets, logos, favicon
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components (Dashboard, Reports, etc.)
│       ├── context/     # React Context (AuthContext)
│       ├── hooks/       # Custom React hooks (useGeolocation)
│       └── App.jsx      # Main application component
├── server/              # Express 4.19 backend (ES6 modules)
│   ├── config/          # Database, Cloudinary, environment config
│   ├── controllers/     # Business logic (auth, reports, users)
│   ├── models/          # Mongoose schemas (User, Report)
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, upload, error handling
│   └── server.js        # Express server entry point
├── docs/                # Documentation, planning, and diagrams
├── .env.example         # Environment variables template
├── package.json         # Root package configuration
├── README.md            # This file
└── LICENSE              # MIT License
```

---

## Key Technical Features

### Backend Architecture

- **Clean MVC Pattern:** Separation of concerns with controllers, models, and routes
- **ES6 Modules:** Modern JavaScript with import/export syntax
- **JWT Authentication:** Secure token-based auth with bcrypt password hashing
- **Mongoose ODM:** MongoDB object modeling with schema validation
- **Geospatial Indexing:** 2dsphere indexes for location-based queries
- **Multer Middleware:** File upload handling with memory storage
- **Cloudinary Integration:** Cloud-based image storage with automatic optimization
- **Email Service:** Nodemailer with Gmail SMTP for transactional emails
- **Error Handling:** Centralized error middleware with detailed messages
- **CORS Configuration:** Cross-origin resource sharing for API security

### Frontend Architecture

- **React 18.3:** Modern React with Hooks (useState, useEffect, useContext)
- **Vite Build Tool:** Fast development server with HMR (Hot Module Replacement)
- **React Router 6:** Client-side routing with protected routes
- **Context API:** Global state management (AuthContext for user authentication)
- **Tailwind CSS:** Utility-first CSS with custom emerald color scheme
- **Framer Motion:** Smooth animations and transitions (loading spinners, page transitions, hover effects)
- **Axios:** HTTP client with interceptors for API calls
- **Image Compression:** Client-side image optimization before upload (Canvas API)
- **Responsive Design:** Mobile-first approach with breakpoints
- **Heroicons:** Beautiful SVG icons for UI elements

### Data Models

- **User Model:** name, email, password (hashed), avatar, ecoPoints, reportsCount
- **Report Model:** title, description, location (GeoJSON Point), images[], wasteType, severity, status, reportedBy (ref: User)

### Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT tokens with expiration (30 days)
- Protected API routes with auth middleware
- Input validation with express-validator
- CORS configured for specific origins
- Environment variables for sensitive data
- File type validation (images only)
- File size limits (10MB per file)

---

## 📱 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Reports

- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create report (protected, multipart/form-data)
- `PATCH /api/reports/:id/status` - Update report status (protected)
- `DELETE /api/reports/:id` - Delete report (protected)
- `GET /api/reports/user/:userId` - Get user's reports

### Users

- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/initials` - Get user initials for avatar

---

## 🚀 Implementation Status

**Current Phase:** MVP Development (V2 Architecture Complete)

### MVP Development Progress (Q4 2025)

- ✅ **Phase 1**: Requirements & Planning Complete
- ✅ **Phase 2**: System Design & Architecture Complete
- ✅ **Phase 3**: Core Implementation Complete
  - [x] Clean V2 architecture with ES6 modules
  - [x] JWT authentication system (register, login, protected routes)
  - [x] User management (profiles, eco-points, reports count)
  - [x] Waste reporting API with geolocation
  - [x] Image upload system (Cloudinary + Multer)
  - [x] Client-side image compression (auto-resize for large files)
  - [x] Dashboard with user statistics and recent reports
  - [x] Reports list page with filtering (status, waste type, severity)
  - [x] Individual report detail pages with status updates
  - [x] Profile page with user stats and information
  - [x] Leaderboard page showing top contributors
  - [x] Modern UI with Tailwind CSS + Framer Motion animations
  - [x] Mobile-responsive design with hamburger menu
  - [x] Form validation & error handling
- ✅ **Phase 4**: Testing & Deployment (Completed)
  - [x] Local development environment working
  - [x] MongoDB Atlas connection configured
  - [x] Cloudinary integration tested
  - [x] Production deployment (Netlify + Render)
  - [x] Live application accessible
  - [ ] End-to-end testing
  - [ ] Domain & SSL setup (using Netlify default)

## 🦯 Roadmap (MVP → Expansion)

**Phase 1 – MVP (Q4 2025) ✅:**

- ✅ Waste site reporting with image uploads and compression
- ✅ User authentication & authorization (JWT)
- ✅ Geolocation-based reporting (browser GPS)
- ✅ Eco-points reward system (10 points per report, 20 for verification, 50 for resolution)
- ✅ Interactive dashboard with user statistics
- ✅ Reports list with filtering capabilities
- ✅ Leaderboard showing top contributors (admins excluded)
- ✅ User profiles with impact tracking
- ✅ Report status management (pending, verified, in-progress, resolved, rejected)
- ✅ Interactive map visualization with Leaflet (color-coded markers, clustering, popups)
- ✅ Admin dashboard with role-based access control
- ✅ Admin notes system for internal report tracking
- ✅ User role management (admin promotion/demotion)
- ✅ Email notification system (welcome, status updates, milestones, admin alerts)

**Phase 2 – Enhanced Features (Q1 2026):**

- ⏳ Report comments & community engagement features
- ⏳ User suspension/ban system for moderation
- ⏳ Advanced analytics with charts and trends
- ⏳ Bulk actions for report management
- ⏳ Heat map view for hotspot analysis
- ⏳ Route optimization for cleanup crews
- ⏳ Export reports to CSV/PDF

**Phase 3 – Smart Expansion (Q2 2026):**

- ⏳ Mobile app version (React Native)
- ⏳ AI waste classification using image recognition
- ⏳ IoT bin integration for smart monitoring
- ⏳ Analytics dashboard for municipalities
- ⏳ Advanced gamification features (badges, achievements)
- ⏳ Multi-language support

## 🛠️ Quick Start for Developers

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

> **💡 Try it live:** You can access the deployed application at [https://reviwa.netlify.app/](https://reviwa.netlify.app/) without any installation.

### Installation

```bash
# Clone the repository
git clone https://github.com/Mayen007/reviwa.git
cd reviwa

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Tests

**Server Tests**

```bash
cd server
npm test
```

**Client Tests**

```bash
cd client
npm test
```

### Deployment

The project uses GitHub Actions for Continuous Integration (CI) and Continuous Deployment (CD).

- **CI Workflow**: Defined in `.github/workflows/ci.yml`. Runs automated tests on every `push` and `pull_request` to `main` and `testing-branch`.
- **CD Workflow**: Defined in `.github/workflows/deploy.yml`. Triggers deployment to Netlify (client) and Render (server) on `push` to `main`.

**Required Secrets for Deployment**

For the CD workflow to function correctly, you must configure the following repository secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token.
- `NETLIFY_SITE_ID`: Your Netlify site ID.
- `RENDER_API_KEY`: Your Render API key.
- `RENDER_SERVICE_ID`: The service ID for your Render backend application.
- `SENTRY_AUTH_TOKEN`: Your Sentry authentication token for release management.

### Run Development Servers

Create `.env` files in both the `server/` and `client/` directories based on the `.env.example` template provided in the root of the repository.

**Server (`.env` in `/server` directory):**

```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_URL=your_cloudinary_url_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ENVIRONMENT=development
```

**Client (`.env` in `/client` directory):**

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Reviwa
VITE_SENTRY_DSN=your_client_sentry_dsn_here
```

### Run Development Servers

```bash
# Terminal 1 - Start backend server
cd server
npm start

# Terminal 2 - Start frontend dev server
cd client
npm run dev
```

Visit `http://localhost:5173` to see the application.

See [SETUP.md](SETUP.md) for detailed setup instructions.

---

## 👥 Contributors

| Name                   | Role                                 |
| ---------------------- | ------------------------------------ |
| **Mayen Akech**        | Project Lead / Full Stack Developer  |
| Open for Contributions | UI/UX, Backend, and Data Integration |

---

## 💚 License

This project is licensed under the **MIT License**.
Feel free to fork, improve, and contribute responsibly.

---

## 💬 Contact & Collaboration

Interested in collaborating, funding, or integrating Reviwa into your city program?

📧 **[reviwa.project@gmail.com](mailto:reviwa.project@gmail.com)**
🌐 Coming soon: [reviwa.io](#)

> _"Cleaner cities start with informed citizens." – Reviwa Team_

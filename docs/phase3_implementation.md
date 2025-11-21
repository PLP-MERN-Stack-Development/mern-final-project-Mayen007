# ⚙️ Reviwa – SDLC Phase 3: Implementation (System Development Plan)

## 🧭 1. Overview

This phase focuses on the actual development of **Reviwa**, translating the system design into functional code using the **MERN stack**. It covers development strategy, environment setup, coding standards, module breakdown, and version control practices.

---

## 🧩 2. Development Strategy

**Approach:** Incremental & Modular Development (Agile-inspired)

- Break project into independent, testable modules.
- Weekly sprints focusing on single deliverables (e.g., authentication, reporting, dashboard).
- Regular integration testing after each module completion.
- Early MVP release for pilot testing and user feedback.

**Development Phases:**

1. Setup & Configuration
2. Frontend Development (React)
3. Backend Development (Express + Node)
4. Database Integration (MongoDB)
5. API Integration & Testing
6. Deployment

---

## 🧰 3. Development Environment Setup

| Component              | Technology / Tool                   |
| ---------------------- | ----------------------------------- |
| **Frontend**           | React.js (Vite + Tailwind CSS)      |
| **Backend**            | Node.js + Express.js                |
| **Database**           | MongoDB Atlas                       |
| **Image Storage**      | Cloudinary                          |
| **Version Control**    | Git + GitHub                        |
| **Deployment**         | Vercel (frontend), Render (backend) |
| **API Testing**        | Postman                             |
| **Project Management** | GitHub Projects (Kanban Board)      |

**Local Setup Instructions:**

```bash
# Clone Repository
git clone https://github.com/username/reviwa.git

# Navigate to directories
cd reviwa/frontend
cd reviwa/backend

# Install dependencies
npm install

# Run backend
npm run dev

# Run frontend
npm run start
```

---

## 🧱 4. Module Breakdown

### A. Authentication Module

**Purpose:** Allow users to register, log in, and maintain sessions.

- JWT Authentication
- Role-based Access (User / Admin / NGO)
- Password hashing (bcrypt)

### B. Waste Reporting Module

**Purpose:** Enable users to report waste issues.

- Form with image upload and geolocation
- Submit reports to backend API
- Display submission status (pending, verified, resolved)

### C. Dashboard Module

**Purpose:** Provide insights and management tools.

- Admin dashboard: manage reports, users, and status updates.
- NGO dashboard: view and support cleanup reports.

### D. Leaderboard & Reward System

**Purpose:** Encourage user engagement.

- Eco-points system for report submissions.
- Leaderboard showing top contributors.
- Reward redemption (phase 2 feature post-MVP).

### E. Analytics Module (Phase 2)

**Purpose:** Visualize environmental data.

- Charts for reports per region/status.
- NGO contributions and cleanup impact tracking.

---

## 🧮 5. Code Structure

```
reviwa/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── App.jsx
│
└── README.md
```

---

## 🧑‍💻 6. Coding Standards

- Use **ESLint + Prettier** for code consistency.
- Follow **RESTful API design principles**.
- Maintain separation of concerns between controllers and routes.
- Use **React Hooks** for state management.
- Commit messages follow conventional format:

  ```bash
  feat(auth): add JWT login
  fix(report): resolve image upload bug
  chore: update dependencies
  ```

---

## 🔄 7. Version Control Workflow

**Branching Model:** Git Feature Branch Workflow

- `main` → stable production code.
- `dev` → active development.
- `feature/*` → per-module branches.

**Example Workflow:**

```bash
git checkout -b feature/auth
# work on feature
git add .
git commit -m "feat(auth): implement login API"
git push origin feature/auth
```

Pull requests will be reviewed and merged into `dev`, followed by integration testing before pushing to `main`.

---

## 🧪 8. Testing Strategy

| Type                    | Tool                  | Purpose                         |
| ----------------------- | --------------------- | ------------------------------- |
| **Unit Testing**        | Jest                  | Validate API endpoints          |
| **Integration Testing** | Supertest             | Test backend and DB connections |
| **Frontend Testing**    | React Testing Library | Ensure UI behavior correctness  |
| **Manual Testing**      | Postman, Browser      | Validate user flows and UX      |

Testing will follow **TDD (Test-Driven Development)** principles where possible.

---

## 🚀 9. Deployment Plan

**Staging Environment:**

- Deploy MVP to test domain (e.g., reviwa-test.vercel.app)
- Connect backend (Render) and database (MongoDB Atlas)

**Production Environment:**

- Deploy stable branch to `reviwa.vercel.app`
- Auto CI/CD using GitHub Actions

**Environment Variables:**

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_URL=your_cloudinary_url
```

---

## 🧩 10. Integration Plan

- Integrate **Google Maps API** for geolocation tagging.
- Use **Cloudinary API** for image uploads.
- Setup **email notifications** via Nodemailer for report updates.
- Implement **leaderboard sync** through MongoDB aggregation queries.

---

## 📅 11. Development Timeline (MVP)

| Sprint   | Duration | Focus Area                 |
| -------- | -------- | -------------------------- |
| Sprint 1 | Week 1–2 | Setup & Authentication     |
| Sprint 2 | Week 3–4 | Reporting Module           |
| Sprint 3 | Week 5–6 | Dashboard & Leaderboard    |
| Sprint 4 | Week 7   | Testing & Integration      |
| Sprint 5 | Week 8   | Deployment & Beta Feedback |

---

## 📈 12. Success Indicators

- MVP fully deployed by end of Sprint 8.
- 90% test coverage for backend endpoints.
- <2s average API response time.
- 100+ active pilot users by launch.

---

> _Reviwa Implementation Plan ensures clean, scalable, and testable development aligned with sustainability impact._

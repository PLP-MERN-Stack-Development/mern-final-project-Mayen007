# 🧠 Reviwa – SDLC Phase 2: System Design

## 🏗️ 1. Overview

This phase defines Reviwa’s technical architecture, data design, and user interface flow. It establishes how the system’s components interact to meet functional and non-functional requirements.

---

## 🧩 2. System Architecture

**Architecture Type:** MERN Stack (Client–Server Model)

**Components:**

- **Frontend:** React.js (SPA) – Handles user interaction and real-time updates.
- **Backend:** Node.js + Express.js – Provides RESTful APIs and authentication.
- **Database:** MongoDB Atlas – Stores users, reports, and environmental data.
- **Cloud Hosting:** Render / Vercel – For scalable deployment.
- **File Storage:** Cloudinary – For image uploads.

**Data Flow Summary:**

1. Users report waste issues through React frontend.
2. Data is sent via REST API to Express backend.
3. Backend validates and stores information in MongoDB.
4. Admin and NGOs retrieve or update reports through dashboards.
5. Responses and updates are rendered in real-time on the client.

**Diagram (Textual Representation):**

```
[React.js Frontend] ⇄ [Express.js API Server] ⇄ [MongoDB Atlas Database]
             ⇅                          ⇅
       [Cloudinary]               [External APIs]
```

---

## 🧱 3. Database Design

### Key Collections

1. **Users**

   - `user_id`
   - `name`
   - `email`
   - `password`
   - `role` (user, admin, ngo)
   - `eco_points`
   - `created_at`

2. **Reports**

   - `report_id`
   - `user_id`
   - `location` (geoJSON or coordinates)
   - `image_url`
   - `description`
   - `status` (pending, verified, resolved)
   - `created_at`

3. **NGOs / Partners**

   - `ngo_id`
   - `name`
   - `email`
   - `sponsorship_details`
   - `supported_reports`

4. **EcoRewards**

   - `reward_id`
   - `title`
   - `description`
   - `points_required`
   - `redeemed_by`

**Relationships:**

- One-to-Many between `Users` and `Reports`.
- Many-to-Many between `Reports` and `NGOs`.
- One-to-Many between `Users` and `EcoRewards` (redeemed).

---

## 🧩 4. API Design (REST Endpoints)

| Method | Endpoint             | Description               | Access        |
| ------ | -------------------- | ------------------------- | ------------- |
| POST   | `/api/auth/register` | Register user             | Public        |
| POST   | `/api/auth/login`    | Login user                | Public        |
| GET    | `/api/reports`       | Fetch all reports         | Admin/NGO     |
| POST   | `/api/reports`       | Submit new report         | Citizen       |
| PATCH  | `/api/reports/:id`   | Update report status      | Admin         |
| GET    | `/api/users/:id`     | Fetch user profile        | Authenticated |
| GET    | `/api/leaderboard`   | View top eco contributors | Public        |

---

## 🖥️ 5. UI / UX Flow

### Citizen Interface

1. **Home Page:** Overview and recent reports.
2. **Report Waste Page:** Submit image, location, and notes.
3. **My Reports:** Track status of personal submissions.
4. **Leaderboard:** View top contributors and earned badges.

### Admin Dashboard

1. **All Reports View:** See pending, verified, or resolved reports.
2. **Verification Panel:** Review user-submitted evidence.
3. **Analytics Section:** View reports per region, status breakdown.

### NGO / Partner Dashboard

1. **Impact Overview:** View supported cleanups.
2. **Sponsorship Section:** Manage partnerships.
3. **Reward Program:** Sponsor eco-points or cleanup materials.

---

## 🔐 6. Security Design

- JWT-based authentication for users and admins.
- Password hashing with bcrypt.
- Role-based access control middleware.
- Validation middleware to prevent malicious submissions.
- HTTPS and CORS configuration for secure data flow.

---

## 📊 7. Data Flow Diagram (Level 1)

```
User → (Report Submission) → Express API → MongoDB (Store Report)
Admin → (View/Verify Reports) → Express API → MongoDB (Update Status)
NGO → (Sponsor Cleanup) → Express API → MongoDB (Record Sponsorship)
```

---

## 📱 8. System Interfaces

- **External APIs:** Google Maps Geolocation API, Cloudinary API.
- **Internal APIs:** Reviwa REST API for authentication, reports, and leaderboard.
- **Integration Points:** CSR systems, NGOs, or municipal portals.

---

## 🧮 9. Hardware & Software Requirements

| Category                   | Requirement                                               |
| -------------------------- | --------------------------------------------------------- |
| **Frontend**               | Browser (Chrome, Firefox, Edge), React 18+                |
| **Backend**                | Node.js 18+, Express 4+, MongoDB Atlas                    |
| **Hosting**                | Render / Vercel (frontend + backend), Cloudinary (images) |
| **Hardware (Development)** | 8GB RAM, 10GB storage, stable internet                    |

---

## 🧩 10. Design Constraints

- Must remain fully functional on low-end devices.
- Mobile-first responsive design.
- Use free-tier or open APIs during MVP phase.
- Limit image size to 2MB per upload.

---

## 📈 11. Success Metrics

- ≥ 500 reports submitted in pilot phase.
- ≥ 60% of reports resolved within first month.
- ≥ 70% user retention post-cleanup events.
- ≥ 3 NGO partnerships established within 3 months.

---

> _Reviwa bridges civic responsibility and sustainability through digital participation._

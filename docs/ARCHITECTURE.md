# Technical Architecture Overview - Reviwa Platform

This document provides a high-level overview of the Reviwa platform's technical architecture, covering its components, technology stack, data flow, and deployment strategy.

## 1. System Overview

Reviwa is a full-stack web application designed for reporting and managing waste-related issues. It consists of a React-based frontend and a Node.js/Express backend, interacting through a RESTful API and WebSockets for real-time features.

## 2. Technology Stack

### Frontend (Client)

- **Framework**: [React.js](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/en/main)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **State Management**: React Context API
- **Real-time Communication**: [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- **Error Tracking**: [Sentry SDK for React](https://sentry.io/for/react/)
- **Testing**: [Vitest](https://vitest.dev/) with `happy-dom` environment, [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)

### Backend (Server)

- **Runtime**: [Node.js](https://nodejs.org/)
- **Web Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/) ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time Communication**: [Socket.IO](https://socket.io/docs/v4/server-api/)
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/) (for image uploads)
- **Email Service**: [Nodemailer](https://nodemailer.com/)
- **Environment Management**: [Dotenv](https://www.npmjs.com/package/dotenv)
- **Error Tracking**: [Sentry SDK for Node.js](https://sentry.io/for/node/)
- **Testing**: [Vitest](https://vitest.dev/), [Supertest](https://github.com/visionmedia/supertest), [mongodb-memory-server](https://github.com/shelfio/mongodb-memory-server)

## 3. Folder Structure

### Client (`client/`)

- `public/`: Static assets, `_redirects` for Netlify.
- `src/`:
  - `assets/`: Images, icons.
  - `components/`: Reusable UI components (e.g., `Navbar`, `LoadingModal`).
  - `context/`: React Context providers for global state (`AuthContext`, `SocketContext`).
  - `pages/`: Page-specific components (`Dashboard`, `Login`, `Map`).
  - `__tests__/`: Unit and integration tests for React components.
  - `App.jsx`: Main application component.
  - `main.jsx`: Entry point, Sentry initialization.
  - `setupTests.js`: Jest-dom setup, IntersectionObserver mock.
  - `vitest-preload.cjs`: Node preload shim for environment fixes.

### Server (`server/`)

- `config/`: Database connection, Cloudinary, email service configurations.
- `controllers/`: Request handlers for different routes.
- `middleware/`: Authentication, error handling, file upload middleware.
- `models/`: Mongoose schemas for MongoDB (`User.model.js`, `Report.model.js`).
- `routes/`: API endpoint definitions.
- `services/`: Email service logic.
- `sockets/`: Socket.IO event handling.
- `utils/`: Utility functions (e.g., email templates).
- `scripts/`: Maintenance and seeding scripts.
- `test/`: Server-side test setup and integration tests.
- `app.js`: Express application setup, CORS, Sentry handlers.
- `server.js`: Main entry point, database connection, server start, Socket.IO setup.

## 4. Data Flow & Interactions

- **Frontend to Backend (HTTP/REST)**: The React client makes API requests to the Express server for data retrieval, creation, updates, and deletion (e.g., user authentication, report management). Axios is used for these requests.
- **Frontend to Backend (WebSockets)**: Socket.IO is used for real-time communication, such as notifications, live updates on reports, or chat features.
- **Database Interaction**: The Express server uses Mongoose to interact with MongoDB, storing user profiles, report data, and other application-specific information.
- **Image Uploads**: Images are uploaded from the client to the server, then processed and stored on Cloudinary. Only image URLs are stored in MongoDB.
- **Email Notifications**: The server uses Nodemailer to send email notifications for events like new registrations, password resets, or report status changes.

## 5. Key Components & Features

- **User Authentication & Authorization**: JWT-based system with user and admin roles.
- **Report Management**: CRUD operations for waste reports, including location data and image uploads.
- **Map Visualization**: Interactive map (Leaflet) displaying report locations.
- **Real-time Notifications**: Socket.IO for instant updates to users.
- **Admin Panel**: Dedicated routes and UI for administrative tasks (user management, report moderation, statistics).
- **Error Tracking**: Sentry integrated for monitoring application errors in both frontend and backend.
- **Responsive Design**: Tailwind CSS for a mobile-first and adaptive user experience.

## 6. Error Handling & Monitoring

- **Backend**: Centralized error handling middleware in Express (`errorHandler.js`) captures and formats API errors. Sentry is initialized to capture server-side exceptions and performance data.
- **Frontend**: Error boundaries in React handle UI errors gracefully. Sentry is initialized to track client-side errors and performance.

## 7. Testing Strategy

- **Client (Frontend)**: Unit and integration tests for React components using Vitest, Testing Library, and happy-dom. Mocks are used for browser APIs and external services.
- **Server (Backend)**: Integration tests for API endpoints using Vitest, Supertest, and `mongodb-memory-server` for an isolated database environment.

## 8. Deployment Strategy

- **Continuous Integration (CI)**: GitHub Actions workflow (`ci.yml`) runs automated tests on every push and pull request to ensure code quality.
- **Continuous Deployment (CD)**: GitHub Actions workflow (`deploy.yml`) triggers deployments:
  - **Frontend**: Deployed to [Netlify](https://www.netlify.com/).
  - **Backend**: Deployed to [Render](https://render.com/).
- **Environment Variables**: Configuration relies on environment variables (`.env`) for sensitive information and service URLs, ensuring flexibility across environments.

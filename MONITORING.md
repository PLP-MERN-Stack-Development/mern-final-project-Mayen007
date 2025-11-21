# Monitoring & Error Tracking

This project supports optional Sentry monitoring for server and client. The code will initialize Sentry only when the corresponding DSN is provided via environment variables.

Server

- Package: `@sentry/node` and `@sentry/tracing`
- Environment variable: `SENTRY_DSN` (required to enable), optional `SENTRY_TRACES_SAMPLE_RATE` (default `0.1`).
- Initialization: `server/server.js` initializes Sentry if `SENTRY_DSN` is set. Express request and error handlers are wired in `server/app.js`.

Client

- Package: `@sentry/react` and `@sentry/tracing`
- Environment variable: `VITE_SENTRY_DSN` (set in Netlify or Vite env). Optional `VITE_SENTRY_TRACES_SAMPLE_RATE` (default `0.05`).
- Initialization: `client/src/main.jsx` dynamically imports and initializes Sentry when `VITE_SENTRY_DSN` is present.

Installation

1. Install server-side packages:

```bash
cd server
npm install @sentry/node @sentry/tracing
```

2. Install client-side packages:

```bash
cd client
npm install @sentry/react @sentry/tracing
```

Configuration (example)

- On your deployment platform (Netlify/Render/GHA), set the following secrets/environment variables:
  - `SENTRY_DSN` (server)
  - `SENTRY_TRACES_SAMPLE_RATE` (optional)
  - `VITE_SENTRY_DSN` (client)
  - `VITE_SENTRY_TRACES_SAMPLE_RATE` (optional)

Notes

- The application will log a message when Sentry is (or is not) initialized. If you prefer not to include Sentry in development, omit the DSN locally.
- For richer context, consider adding user context in the server auth flow (e.g., `Sentry.setUser({ id, email })`) and capture additional breadcrumbs around important events.

import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

// Optional Sentry for client-side monitoring
// Requires VITE_SENTRY_DSN to be set in the environment (e.g., Netlify env var)
if (import.meta.env.VITE_SENTRY_DSN) {
  // Use Promise-based dynamic imports (no top-level await)
  Promise.all([import("@sentry/react"), import("@sentry/tracing")])
    .then(([SentryModule, tracingModule]) => {
      try {
        const Sentry = SentryModule;
        const { BrowserTracing } = tracingModule;
        Sentry.init({
          dsn: import.meta.env.VITE_SENTRY_DSN,
          integrations: [new BrowserTracing()],
          tracesSampleRate: parseFloat(
            import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || "0.05"
          ),
          environment: import.meta.env.MODE || "development",
        });
        // eslint-disable-next-line no-console
        console.log("📡 Sentry (client) initialized");
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          "Sentry (client) initialization failed:",
          err?.message || err
        );
      }
    })
    .catch((err) => {
      // If package not installed or import fails, log but don't break app
      // eslint-disable-next-line no-console
      console.warn("Sentry (client) not initialized:", err?.message || err);
    });
}

// Configure axios base URL from environment variable (set VITE_API_URL on Netlify)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotificationProvider>
      <SocketProvider>
        <App />
        <ToastContainer />
      </SocketProvider>
    </NotificationProvider>
  </React.StrictMode>
);

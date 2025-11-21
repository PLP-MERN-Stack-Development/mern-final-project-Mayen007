import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import * as Sentry from '@sentry/node';

// Import routes
import authRoutes from './routes/auth.routes.js';
import reportRoutes from './routes/report.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

// If Sentry is available (initialized in server entry), wire request handler
// Note: Sentry is conditionally initialized in `server.js` so `Sentry.getCurrentHub()` may be no-op when DSN not set.
if (process.env.SENTRY_DSN) {
  try {
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
  } catch (err) {
    console.warn('Sentry requestHandler not applied:', err?.message || err);
  }
}

// Configure CORS allowed origins (same logic as server entrypoint)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://reviwa.netlify.app',
  process.env.CLIENT_URL
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ''));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    exposedHeaders: ['sentry-trace', 'baggage'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // Include Sentry trace headers so browser SDK can attach tracing headers
    // (sentry-trace and baggage) without being blocked by CORS preflight.
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'sentry-trace',
      'baggage'
    ]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Reviwa API is running', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
// Attach Sentry error handler before our custom error handler so Sentry captures exceptions
if (process.env.SENTRY_DSN) {
  try {
    app.use(Sentry.Handlers.errorHandler());
  } catch (err) {
    console.warn('Sentry errorHandler not applied:', err?.message || err);
  }
}

app.use(errorHandler);

export default app;

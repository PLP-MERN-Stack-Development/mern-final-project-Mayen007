import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export default function registerSockets(io) {
  io.on('connection', async (socket) => {
    // Try to authenticate socket using token passed in handshake auth
    const token = socket.handshake?.auth?.token ||
      (socket.handshake?.headers?.authorization?.startsWith('Bearer')
        ? socket.handshake.headers.authorization.split(' ')[1]
        : null);

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          socket.user = user;
          // Join useful rooms
          if (user.role === 'admin') socket.join('admins');
          socket.join(`user:${user._id}`);
        }
      } catch (err) {
        // Invalid token: do not attach user. We choose to allow connection
        // but without an authenticated user. Optionally you can socket.disconnect().
        console.warn('Socket auth failed:', err.message);
      }
    }

    // Room helpers for report pages
    socket.on('joinReport', (reportId) => {
      if (reportId) socket.join(`report:${reportId}`);
    });

    socket.on('leaveReport', (reportId) => {
      if (reportId) socket.leave(`report:${reportId}`);
    });

    socket.on('disconnect', (reason) => {
      // cleanup if needed
    });
  });

  console.log('⚡ Socket handlers registered');
}

// Optional helpers could be added here and imported by controllers, but
// controllers can access `io` via `req.app.locals.io` once initialized.

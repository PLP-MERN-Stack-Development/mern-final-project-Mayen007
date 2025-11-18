# API Endpoints and Data Flow for Event Management System

## API Endpoints

### Authentication

- POST /api/auth/register: Register a new user (body: name, email, password, role)
- POST /api/auth/login: Login user (body: email, password) -> returns token and user info

### Events

- GET /api/events: Get all events (public)
- GET /api/events/:id: Get event details (public)
- POST /api/events: Create new event (auth: organizer/admin, body: title, description, date, time, location, capacity, category, price)
- PUT /api/events/:id: Update event (auth: organizer/admin of event)
- DELETE /api/events/:id: Delete event (auth: organizer/admin of event)

### Registrations

- POST /api/registrations: Register for event (auth, body: eventId, ticketType, quantity) -> creates registration and tickets
- GET /api/registrations: Get user's registrations (auth)

### Tickets (future: add endpoints for ticket management)

## Data Flow

1. User registers/logs in via /api/auth
2. User fetches events via GET /api/events
3. User views event details via GET /api/events/:id
4. User registers via POST /api/registrations (checks capacity, generates tickets)
5. Real-time updates via Socket.io on registrations
6. User views their registrations/tickets via GET /api/registrations

## Error Handling

- 400: Bad request (validation errors)
- 401: Unauthorized (no token/invalid)
- 403: Forbidden (wrong role)
- 404: Not found
- 500: Server error

## Middleware

- Auth: Checks JWT token, attaches user to req
- CORS: Allows frontend requests
- JSON parser: Parses request bodies

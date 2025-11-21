# API Documentation

This document describes the RESTful API endpoints provided by the Reviwa server.

## Base URL

The API base URL is dependent on your deployment environment.

- **Development**: `http://localhost:5000/api`
- **Production**: (Your deployed server URL, e.g., `https://api.reviwa.com/api`)

## Authentication

All protected endpoints require a JSON Web Token (JWT) in the `Authorization` header.
To authenticate, send a `POST` request to `/auth/login` with user credentials.
The response will include a `token` that should be used for subsequent requests:

`Authorization: Bearer <your-jwt-token>`

### Obtaining a Token (Login Example)

**Request**
`POST /auth/login`
Content-Type: `application/json`

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (Success)**
Status: `200 OK`
Content-Type: `application/json`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "654321098765432109876543",
    "email": "user@example.com",
    "username": "exampleuser",
    "role": "user"
  }
}
```

**Response (Error)**
Status: `401 Unauthorized`
Content-Type: `application/json`

```json
{
  "message": "Invalid credentials"
}
```

## Data Models

Refer to the `DATA_MODELS.md` file in the project root for detailed schemas of `User` and `Report` models.

## Endpoints

### User Authentication

- `POST /auth/register`
  - **Description**: Registers a new user.
  - **Request Body**:
    ```json
    {
      "username": "newuser",
      "email": "newuser@example.com",
      "password": "securepassword123"
    }
    ```
  - **Response**: `201 Created` with user data.
- `POST /auth/login`
  - **Description**: Authenticates a user and returns a JWT. (See example above)
- `POST /auth/logout`
  - **Description**: Logs out the current user (invalidates JWT on the client side, typically).
  - **Authentication**: Required
  - **Response**: `200 OK`

### User Management

- `GET /users/profile`
  - **Description**: Retrieves the authenticated user's profile.
  - **Authentication**: Required
  - **Response**: `200 OK` with user profile data.
- `PUT /users/profile`
  - **Description**: Updates the authenticated user's profile.
  - **Authentication**: Required
  - **Request Body**: (e.g., `{"username": "updatedname", "email": "updated@example.com"}`)
  - **Response**: `200 OK` with updated user profile data.

### Report Management

- `GET /reports`
  - **Description**: Retrieves all reports (with optional filtering/pagination).
  - **Authentication**: Required
  - **Response**: `200 OK` with an array of report objects.
- `POST /reports`
  - **Description**: Creates a new report.
  - **Authentication**: Required
  - **Request Body**:
    ```json
    {
      "title": "Illegal Dumping on Main Street",
      "description": "Large pile of waste near the park entrance.",
      "location": {
        "type": "Point",
        "coordinates": [34.0522, -118.2437]
      },
      "category": "Illegal Dumping",
      "images": ["url_to_image1.jpg"]
    }
    ```
  - **Response**: `201 Created` with the new report object.
- `GET /reports/:id`
  - **Description**: Retrieves a single report by ID.
  - **Authentication**: Required
  - **Response**: `200 OK` with the report object.
- `PUT /reports/:id`
  - **Description**: Updates a report by ID.
  - **Authentication**: Required
  - **Request Body**: (e.g., `{"status": "resolved"}`)
  - **Response**: `200 OK` with the updated report object.
- `DELETE /reports/:id`
  - **Description**: Deletes a report by ID.
  - **Authentication**: Required
  - **Response**: `204 No Content`

### Admin Endpoints

Admin endpoints require `admin` role authentication.

- `GET /admin/users`
  - **Description**: Retrieves all user accounts.
  - **Authentication**: Admin Required
  - **Response**: `200 OK` with an array of user objects.
- `GET /admin/reports`
  - **Description**: Retrieves all reports (can include advanced filtering/stats for admin).
  - **Authentication**: Admin Required
  - **Response**: `200 OK` with an array of report objects.
- `PUT /admin/reports/:id/status`
  - **Description**: Updates the status of a report.
  - **Authentication**: Admin Required
  - **Request Body**: `{"status": "processing"}`
  - **Response**: `200 OK` with the updated report object.
- `DELETE /admin/users/:id`
  - **Description**: Deletes a user account.
  - **Authentication**: Admin Required
  - **Response**: `204 No Content`
- `GET /admin/stats`
  - **Description**: Retrieves system statistics (e.g., total users, reports by status).
  - **Authentication**: Admin Required
  - **Response**: `200 OK` with statistics data.

# Testing Implementation Guide

This document provides comprehensive information about testing in the Reviwa application.

## Table of Contents

1. [Overview](#overview)
2. [Backend Testing](#backend-testing)
3. [Frontend Testing](#frontend-testing)
4. [Running Tests](#running-tests)
5. [Writing Tests](#writing-tests)
6. [CI/CD Integration](#cicd-integration)
7. [Best Practices](#best-practices)

---

## Overview

The Reviwa application uses a comprehensive testing strategy that includes:

- **Backend**: Jest + Supertest + MongoDB Memory Server
- **Frontend**: Vitest + React Testing Library + jsdom
- **Coverage**: Minimum 70% code coverage target
- **Types**: Unit tests, integration tests, and component tests

### Testing Stack

#### Backend

- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for API testing
- **MongoDB Memory Server**: In-memory MongoDB for isolated testing
- **@jest/globals**: ES modules support for Jest

#### Frontend

- **Vitest**: Fast unit test framework (Vite-native)
- **React Testing Library**: React component testing utilities
- **jsdom**: DOM implementation for Node.js
- **@testing-library/user-event**: User interaction simulation

---

## Backend Testing

### Setup

The backend testing environment is configured with:

1. **jest.config.js** - Jest configuration for ES modules
2. ****tests**/setup.js** - Test utilities and setup functions
3. **.env.test** - Test environment variables

### Test Structure

```
server/
  __tests__/
    setup.js          # Test setup utilities
    auth.test.js      # Authentication tests
    report.test.js    # Report CRUD tests
    models.test.js    # Database model tests
```

### Running Backend Tests

```bash
# Navigate to server directory
cd server

# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Categories

#### 1. Authentication Tests (`auth.test.js`)

Tests user registration, login, and authentication:

```javascript
// Test registration
POST /api/auth/register
- ✓ Register new user successfully
- ✓ Reject duplicate email
- ✓ Validate required fields

// Test login
POST /api/auth/login
- ✓ Login with valid credentials
- ✓ Reject invalid credentials
- ✓ Reject non-existent user

// Test profile
GET /api/auth/me
- ✓ Get profile with valid token
- ✓ Reject without token
- ✓ Reject with invalid token
```

#### 2. Report Tests (`report.test.js`)

Tests report CRUD operations:

```javascript
// Create reports
POST /api/reports
- ✓ Create report with valid data
- ✓ Reject unauthenticated requests
- ✓ Validate required fields

// Read reports
GET /api/reports
- ✓ Get all reports
- ✓ Filter by status
- ✓ Filter by wasteType

GET /api/reports/:id
- ✓ Get single report
- ✓ Return 404 for non-existent report

// Update reports
PUT /api/reports/:id
- ✓ Update own report
- ✓ Reject unauthenticated updates

// Delete reports
DELETE /api/reports/:id
- ✓ Delete own report
- ✓ Reject unauthenticated deletions
```

#### 3. Model Tests (`models.test.js`)

Tests database models and validation:

```javascript
// User Model
- ✓ Create user with valid data
- ✓ Hash password before saving
- ✓ Match correct password
- ✓ Reject duplicate email
- ✓ Validate email format

// Report Model
- ✓ Create report with valid data
- ✓ Validate required fields
- ✓ Validate enums (wasteType, severity, status)
- ✓ Populate reporter information
```

### Test Utilities

The `setup.js` file provides helper functions:

```javascript
// Database setup/teardown
setupTestDB(); // Create in-memory MongoDB
teardownTestDB(); // Cleanup and disconnect
clearTestDB(); // Clear all collections

// Mocking
mockEmailService(); // Mock email sending
mockCloudinary(); // Mock image uploads
```

---

## Frontend Testing

### Setup

The frontend testing environment is configured with:

1. **vitest.config.js** - Vitest configuration
2. **src/**tests**/setup.js** - Global test setup
3. **src/**tests**/testUtils.js** - Testing utilities

### Test Structure

```
client/
  src/
    __tests__/
      setup.js              # Global test setup
      testUtils.js          # Test utilities and mocks
      Navbar.test.jsx       # Navbar component tests
      Login.test.jsx        # Login page tests
      ConfirmDialog.test.jsx # Dialog component tests
```

### Running Frontend Tests

```bash
# Navigate to client directory
cd client

# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Categories

#### 1. Component Tests

Test React components in isolation:

```javascript
// Navbar.test.jsx
- ✓ Render logo and brand
- ✓ Show login links when unauthenticated
- ✓ Show navigation when authenticated
- ✓ Display user profile
- ✓ Display eco points

// ConfirmDialog.test.jsx
- ✓ Hide when closed
- ✓ Show when open
- ✓ Call onConfirm handler
- ✓ Call onCancel handler
- ✓ Use custom button labels
```

#### 2. Page Tests

Test complete page rendering and interactions:

```javascript
// Login.test.jsx
- ✓ Render login form
- ✓ Display validation errors
- ✓ Submit form with valid data
- ✓ Show link to register page
```

### Test Utilities

The `testUtils.js` file provides:

```javascript
// Mock contexts
mockAuthContext; // Mock authentication state
mockLoadingContext; // Mock loading state

// Wrapper components
AllTheProviders; // Wraps components with Router + Contexts

// Mock API
mockAxios; // Mock axios instance
mockSuccessResponse(); // Generate success responses
mockErrorResponse(); // Generate error responses
```

---

## Running Tests

### Quick Commands

```bash
# Backend tests
cd server
npm test                 # Run once
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage

# Frontend tests
cd client
npm test                 # Watch mode by default
npm run test:ui         # Visual UI
npm run test:coverage   # With coverage

# Run all tests (from root)
cd server && npm test && cd ../client && npm test
```

### Coverage Reports

Both backend and frontend generate coverage reports in the `coverage/` directory:

```
coverage/
  lcov-report/
    index.html    # Open this in browser for visual coverage report
  coverage-final.json
```

### Coverage Thresholds

Recommended minimum coverage:

- **Statements**: 70%
- **Branches**: 65%
- **Functions**: 70%
- **Lines**: 70%

---

## Writing Tests

### Backend Test Example

```javascript
import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import request from "supertest";
import express from "express";
import { setupTestDB, teardownTestDB, clearTestDB } from "./setup.js";
import myRoutes from "../routes/my.routes.js";

const app = express();
app.use(express.json());
app.use("/api/my", myRoutes);

describe("My API", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  test("should do something", async () => {
    const response = await request(app).get("/api/my/endpoint").expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

### Frontend Test Example

```javascript
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import MyComponent from "../components/MyComponent";

describe("MyComponent", () => {
  test("should render content", () => {
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    );

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  test("should handle click events", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <BrowserRouter>
        <MyComponent onClick={handleClick} />
      </BrowserRouter>
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        working-directory: ./server
        run: npm ci

      - name: Run tests
        working-directory: ./server
        run: npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./server/coverage/coverage-final.json
          flags: backend

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        working-directory: ./client
        run: npm ci

      - name: Run tests
        working-directory: ./client
        run: npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./client/coverage/coverage-final.json
          flags: frontend
```

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run backend tests
cd server && npm test || exit 1

# Run frontend tests
cd ../client && npm test || exit 1
```

---

## Best Practices

### General

1. **Write tests first** (TDD approach when possible)
2. **Keep tests simple** and focused on one thing
3. **Use descriptive test names** that explain what is being tested
4. **Mock external dependencies** (APIs, databases, services)
5. **Clean up after tests** (use afterEach/afterAll hooks)
6. **Test edge cases** and error conditions
7. **Maintain test coverage** above 70%

### Backend

1. **Use in-memory database** for speed and isolation
2. **Test API contracts** (request/response format)
3. **Test authentication** and authorization
4. **Validate input** handling and error messages
5. **Test database operations** (CRUD)
6. **Mock external services** (email, file uploads)

### Frontend

1. **Test user interactions** not implementation details
2. **Use semantic queries** (getByRole, getByLabelText)
3. **Test accessibility** (ARIA labels, keyboard navigation)
4. **Mock API calls** to avoid network dependencies
5. **Test error states** and loading states
6. **Test responsive behavior** when needed

### Don't Test

1. **Third-party libraries** (assume they work)
2. **Implementation details** (internal state, private methods)
3. **Styling** (unless critical to functionality)
4. **Generated code** or boilerplate

---

## Troubleshooting

### Common Issues

#### Backend

**Issue**: Tests timeout

```javascript
// Solution: Increase timeout in jest.config.js
testTimeout: 30000;
```

**Issue**: MongoDB connection errors

```javascript
// Solution: Ensure proper cleanup
afterAll(async () => {
  await teardownTestDB();
});
```

**Issue**: ES modules not working

```javascript
// Solution: Check jest.config.js
export default {
  transform: {},
  extensionsToTreatAsEsm: [".js"],
};
```

#### Frontend

**Issue**: "window is not defined"

```javascript
// Solution: Check vitest.config.js
test: {
  environment: 'jsdom',
}
```

**Issue**: React hooks error

```javascript
// Solution: Wrap components properly
render(
  <BrowserRouter>
    <AuthProvider>
      <Component />
    </AuthProvider>
  </BrowserRouter>
);
```

---

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

---

## Next Steps

1. **Install dependencies** for both backend and frontend
2. **Run existing tests** to ensure setup is working
3. **Write additional tests** for uncovered code
4. **Set up CI/CD** to run tests automatically
5. **Monitor coverage** and improve over time

For questions or issues, refer to the project documentation or open an issue on GitHub.

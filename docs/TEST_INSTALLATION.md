# Test Installation Guide

This guide walks you through setting up the testing environment for the Reviwa application.

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

## Backend Testing Setup

### 1. Navigate to Server Directory

```bash
cd server
```

### 2. Install Testing Dependencies

```bash
npm install --save-dev jest supertest @jest/globals cross-env mongodb-memory-server
```

This installs:

- **jest**: Testing framework
- **supertest**: HTTP testing library
- **@jest/globals**: ES modules support
- **cross-env**: Cross-platform environment variables
- **mongodb-memory-server**: In-memory database for testing

### 3. Verify Installation

Check that the following packages are in `package.json`:

```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.3.0",
    "@jest/globals": "^29.0.0",
    "cross-env": "^7.0.3",
    "mongodb-memory-server": "^9.0.0"
  }
}
```

### 4. Run Backend Tests

```bash
npm test
```

Expected output:

```
PASS  __tests__/auth.test.js
PASS  __tests__/report.test.js
PASS  __tests__/models.test.js

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
```

## Frontend Testing Setup

### 1. Navigate to Client Directory

```bash
cd client
```

### 2. Install Testing Dependencies

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

This installs:

- **vitest**: Fast testing framework (Vite-native)
- **@testing-library/react**: React testing utilities
- **@testing-library/jest-dom**: Custom matchers
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM implementation for Node
- **@vitest/ui**: Interactive test UI

### 3. Verify Installation

Check that the following packages are in `package.json`:

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^23.0.0",
    "@vitest/ui": "^1.0.0"
  }
}
```

### 4. Run Frontend Tests

```bash
npm test
```

Expected output:

```
✓ src/__tests__/Navbar.test.jsx (5 tests)
✓ src/__tests__/Login.test.jsx (4 tests)
✓ src/__tests__/ConfirmDialog.test.jsx (5 tests)

Test Files  3 passed (3)
Tests  14 passed (14)
```

## Troubleshooting

### Backend Issues

#### Issue: "Cannot find module"

**Solution**: Ensure you're using ES modules:

```json
// package.json
{
  "type": "module"
}
```

#### Issue: Tests timeout

**Solution**: Increase timeout in `jest.config.js`:

```javascript
export default {
  testTimeout: 30000,
};
```

#### Issue: MongoDB connection errors

**Solution**: The tests use an in-memory database, so no MongoDB installation is needed. If you see errors, try:

```bash
npm install mongodb-memory-server --force
```

### Frontend Issues

#### Issue: "window is not defined"

**Solution**: Check `vitest.config.js`:

```javascript
export default defineConfig({
  test: {
    environment: "jsdom",
  },
});
```

#### Issue: React hooks error

**Solution**: Ensure components are wrapped with providers:

```javascript
render(
  <BrowserRouter>
    <AuthProvider>
      <Component />
    </AuthProvider>
  </BrowserRouter>
);
```

#### Issue: Module not found

**Solution**: Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Running Tests in Watch Mode

### Backend

```bash
npm run test:watch
```

### Frontend

```bash
npm test
# Vitest runs in watch mode by default
```

## Generating Coverage Reports

### Backend

```bash
npm run test:coverage
```

Open `coverage/lcov-report/index.html` in your browser.

### Frontend

```bash
npm run test:coverage
```

Open `coverage/index.html` in your browser.

## Next Steps

1. ✅ Install all dependencies
2. ✅ Run tests to verify setup
3. ✅ Review test files to understand patterns
4. ✅ Write additional tests for new features
5. ✅ Set up CI/CD (GitHub Actions already configured)

## Additional Commands

### Run specific test file

```bash
# Backend
npm test -- auth.test.js

# Frontend
npm test -- Navbar.test.jsx
```

### Run tests matching pattern

```bash
# Backend
npm test -- --testNamePattern="login"

# Frontend
npm test -- --grep="should render"
```

### Update snapshots

```bash
# Backend
npm test -- -u

# Frontend
npm test -- -u
```

## Resources

- [Backend Test Examples](../server/__tests__/)
- [Frontend Test Examples](../client/src/__tests__/)
- [Testing Guide](./TESTING_GUIDE.md)
- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/)

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review the test files for examples
3. Check the documentation links above
4. Open an issue on GitHub with error details

---

**Last Updated**: November 2025

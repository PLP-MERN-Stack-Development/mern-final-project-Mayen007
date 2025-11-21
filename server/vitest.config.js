import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setupTests.js'],
    // Run tests in a single thread to avoid multiple in-memory mongo instances
    threads: false,
    coverage: {
      provider: 'c8'
    }
  }
});

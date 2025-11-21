import '@testing-library/jest-dom';

// Optionally add global mocks here (e.g., fetch, geolocation)
// Example: provide a noop for window.scrollTo used by some components
window.scrollTo = window.scrollTo || function () { };

// JSDOM doesn't implement IntersectionObserver which some libs (framer-motion)
// rely on — provide a lightweight mock for tests.
class IntersectionObserver {
  constructor() { }
  observe() { }
  unobserve() { }
  disconnect() { }
}

global.IntersectionObserver = global.IntersectionObserver || IntersectionObserver;

// Polyfill SharedArrayBuffer and related ArrayBuffer properties in the test
// environment. Some transitive deps (webidl-conversions / whatwg-url)
// expect these built-ins to exist and attempt to read property descriptors
// during module initialization which fails in older jsdom/node setups.
if (typeof globalThis.SharedArrayBuffer === 'undefined') {
  // Point SharedArrayBuffer to ArrayBuffer for tests (safe shim)
  globalThis.SharedArrayBuffer = ArrayBuffer;
}

// Ensure `resizable` / `growable` descriptors exist to avoid
// `Object.getOwnPropertyDescriptor(...).get` accessing undefined.
if (!Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'resizable')) {
  Object.defineProperty(ArrayBuffer.prototype, 'resizable', {
    configurable: true,
    get() { return false; }
  });
}

if (!Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'growable')) {
  Object.defineProperty(SharedArrayBuffer.prototype, 'growable', {
    configurable: true,
    get() { return false; }
  });
}

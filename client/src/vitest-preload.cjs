// Preload shim to run before Vitest loads any modules.
// This file is required with Node's `-r` so it must be CommonJS.
// It defines `SharedArrayBuffer` and safe descriptors so modules
// like `webidl-conversions` / `whatwg-url` don't throw during init.

if (typeof globalThis.SharedArrayBuffer === 'undefined') {
  // Point SharedArrayBuffer to ArrayBuffer for tests (safe shim)
  globalThis.SharedArrayBuffer = ArrayBuffer;
}

try {
  if (!Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'resizable')) {
    Object.defineProperty(ArrayBuffer.prototype, 'resizable', {
      configurable: true,
      get() { return false; }
    });
  }
} catch (e) {
  // ignore if the environment doesn't allow modifying descriptors
}

try {
  if (typeof globalThis.SharedArrayBuffer !== 'undefined' && !Object.getOwnPropertyDescriptor(globalThis.SharedArrayBuffer.prototype, 'growable')) {
    Object.defineProperty(globalThis.SharedArrayBuffer.prototype, 'growable', {
      configurable: true,
      get() { return false; }
    });
  }
} catch (e) {
  // ignore
}

// Also provide a minimal global IntersectionObserver if missing (extra safety)
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
  }
  globalThis.IntersectionObserver = IntersectionObserver;
}

// No exports; this file just sets globals.

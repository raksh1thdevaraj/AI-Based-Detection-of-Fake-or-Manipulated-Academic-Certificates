import '@testing-library/jest-dom';

// Polyfill window.URL.createObjectURL and revokeObjectURL for tests
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = (_blob: Blob | MediaSource) => 'mock-blob-url';

  window.URL.revokeObjectURL = (_url: string) => {};
}

// Polyfill navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: (_text: string) => Promise.resolve(),
  },
});

// Polyfill HTMLCanvasElement.prototype.getContext for jsdom
if (typeof HTMLCanvasElement !== 'undefined') {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: any[]): any {
    try {
      if (originalGetContext) {
        return originalGetContext.call(this, contextId, ...args);
      }
    } catch {
      // ignore
    }
    return null;
  } as any;
}

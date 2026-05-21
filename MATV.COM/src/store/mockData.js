// Legacy compatibility file - all data is now in individual store files
// This file provides backward compatibility and will be removed in future versions

console.warn('mockData.js is deprecated. Please import directly from individual store files.');

// Re-export from new store architecture for backward compatibility
export * from './index.js';
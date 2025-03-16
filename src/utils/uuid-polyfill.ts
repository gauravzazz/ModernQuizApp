/**
 * UUID v4 Generator Polyfill for environments without crypto support
 * - Provides RFC 4122 compliant version 4 UUIDs
 * - Safe fallback for React Native and legacy browsers
 * - Compatible with TypeScript DOM types
 */

// Import the React Native polyfill for crypto.getRandomValues
import 'react-native-get-random-values';

// Wrap global augmentation in module declaration
// Correct global declaration
declare global {
  interface Window {
    crypto?: {
      getRandomValues?<T extends ArrayBufferView>(array: T): T;
      randomUUID?: () => string;
    };
    msCrypto?: Crypto;
  }
}

// Define global for React Native environments
declare const global: {
  crypto?: {
    getRandomValues?<T extends ArrayBufferView>(array: T): T;
    randomUUID?: () => string;
  };
}

// Minimal type implementations to avoid DOM type conflicts
interface Crypto {
  getRandomValues<T extends ArrayBufferView>(array: T): T;
  randomUUID(): string;
  subtle: {};
}

// Create a robust crypto polyfill that works in all environments
const cryptoPolyfill: Crypto = {
  getRandomValues<T extends ArrayBufferView>(array: T): T {
    // This should now be handled by react-native-get-random-values
    // but we keep this as a fallback just in case
    if (!array?.buffer) return array;

    try {
      // Try to use the global crypto if available (should be provided by react-native-get-random-values)
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        return crypto.getRandomValues(array);
      }
    } catch (e) {
      console.warn('Native crypto.getRandomValues failed, falling back to Math.random', e);
    }

    // Fallback to Math.random() for byte generation
    const buffer = new Uint8Array(array.buffer);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }

    // Support all ArrayBufferView types (Int32Array, etc)
    new Uint8Array(array.buffer).set(buffer);
    return array;
  },

  randomUUID(): string {
    // Use native randomUUID if available
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      try {
        return crypto.randomUUID();
      } catch (e) {
        console.warn('Native crypto.randomUUID failed, using polyfill', e);
      }
    }

    // Generate 16 random bytes (128 bits)
    const buffer = new Uint8Array(16);
    this.getRandomValues(buffer);

    // Set version 4 bits (RFC 4122 §4.1.3)
    buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant 10

    // Convert bytes to hex strings
    const hexBytes = [];
    for (let i = 0; i < buffer.length; i++) {
      hexBytes.push(buffer[i].toString(16).padStart(2, '0'));
    }

    // Format as RFC4122 UUID
    return [
      hexBytes.slice(0, 4).join(''),
      hexBytes.slice(4, 6).join(''),
      hexBytes.slice(6, 8).join(''),
      hexBytes.slice(8, 10).join(''),
      hexBytes.slice(10, 16).join('')
    ].join('-');
  },

  subtle: {} // Required stub
};

// Install polyfill based on environment
if (typeof window !== 'undefined') {
  // Browser environment
  if (!window.crypto || !window.crypto.randomUUID) {
    (window as any).crypto = cryptoPolyfill;
    (window as any).msCrypto = cryptoPolyfill;
  }
} else if (typeof global !== 'undefined') {
  // Proper initialization for React Native environment
  if (!global.crypto) {
    (global as any).crypto = cryptoPolyfill;
  }
  // Ensure randomUUID exists in crypto
  if (global.crypto && !global.crypto.randomUUID) {
    (global.crypto as any).randomUUID = cryptoPolyfill.randomUUID;
  }
}

// Add empty export to mark as module
export {};
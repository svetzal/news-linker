/**
 * Utility functions for encoding and decoding URLs
 * 
 * The encoding is a custom algorithm that:
 * 1. Compresses the URL using a simple run-length encoding
 * 2. Obfuscates the result using a custom character mapping
 * 3. Ensures the result is URL-safe
 */

// Custom character mapping for obfuscation (not using standard Base64)
const CHAR_MAP = {
  encode: {
    'a': 'Q', 'b': 'W', 'c': 'E', 'd': 'R', 'e': 'T', 'f': 'Y', 'g': 'U', 'h': 'I',
    'i': 'O', 'j': 'P', 'k': 'A', 'l': 'S', 'm': 'D', 'n': 'F', 'o': 'G', 'p': 'H',
    'q': 'J', 'r': 'K', 's': 'L', 't': 'Z', 'u': 'X', 'v': 'C', 'w': 'V', 'x': 'B',
    'y': 'N', 'z': 'M', 'A': 'q', 'B': 'w', 'C': 'e', 'D': 'r', 'E': 't', 'F': 'y',
    'G': 'u', 'H': 'i', 'I': 'o', 'J': 'p', 'K': 'a', 'L': 's', 'M': 'd', 'N': 'f',
    'O': 'g', 'P': 'h', 'Q': 'j', 'R': 'k', 'S': 'l', 'T': 'z', 'U': 'x', 'V': 'c',
    'W': 'v', 'X': 'b', 'Y': 'n', 'Z': 'm', '0': '5', '1': '6', '2': '7', '3': '8',
    '4': '9', '5': '0', '6': '1', '7': '2', '8': '3', '9': '4', '/': '_', '.': '-',
    ':': '+', '?': '~', '=': '*', '&': '@', '%': '#', '+': '$', '-': '!', '_': '^',
    ' ': '`', '#': '{', '@': '}'
  }
};

// Create the decode mapping from the encode mapping
CHAR_MAP.decode = Object.entries(CHAR_MAP.encode).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

/**
 * Simple run-length encoding for compression
 * @param {string} str - The string to compress
 * @returns {string} - The compressed string
 */
function compressRLE(str) {
  let result = '';
  let count = 1;
  let char = str[0];
  let inQueryParam = false;

  for (let i = 1; i <= str.length; i++) {
    // Check if we're in a query parameter section
    if (str[i-1] === '?' || str[i-1] === '&') {
      inQueryParam = true;
    } else if (str[i-1] === ' ' || str[i-1] === '#') {
      inQueryParam = false;
    }

    if (i === str.length || str[i] !== char) {
      // Only use RLE for runs of 4 or more characters
      // But don't compress digits in query parameters or dashes
      const isDigit = /\d/.test(char);
      const isDash = char === '-';
      const shouldCompress = count >= 4 && !(inQueryParam && isDigit) && !isDash;

      if (shouldCompress) {
        result += char + count;
      } else {
        result += char.repeat(count);
      }
      char = str[i];
      count = 1;
    } else {
      count++;
    }
  }

  return result;
}

/**
 * Decompress a string compressed with run-length encoding
 * @param {string} str - The compressed string
 * @returns {string} - The decompressed string
 */
function decompressRLE(str) {
  let result = '';
  let i = 0;

  while (i < str.length) {
    const char = str[i];
    i++;

    // Check if the next characters are digits (potentially indicating a run)
    let countStr = '';
    let j = i;
    while (j < str.length && /\d/.test(str[j])) {
      countStr += str[j];
      j++;
    }

    // Only treat it as a run-length encoded sequence if:
    // 1. There are digits after the character
    // 2. The digits form a valid count (> 3, since we only compress runs of 4+ characters)
    // 3. The next character after the digits is different from the current character
    //    (to avoid treating parts of URLs like "2025/04/06" as RLE sequences)
    if (countStr && parseInt(countStr, 10) > 3) {
      const count = parseInt(countStr, 10);

      // Special handling for dates in URLs (like 2023-12-31)
      const isPreviousCharDigit = i > 1 && /\d/.test(str[i-2]);
      const isNextCharDash = j < str.length && str[j] === '-';
      const isLikelyDatePart = isPreviousCharDigit && isNextCharDash && countStr.length <= 2;

      // Special handling for dates in URLs and other special cases
      const isInQueryParam = str.substring(0, i).includes('?') || str.substring(0, i).includes('&');

      // Check if this is likely a part of a URL rather than RLE
      const isLikelyPartOfUrl = 
        // If it's likely part of a date (e.g., 2023-12-31)
        isLikelyDatePart ||
        // If the character is a digit (numbers in URLs), but not in a query parameter with repeated digits
        (/\d/.test(char) && (!isInQueryParam || countStr.length <= 2)) ||
        // If the character is a special character commonly used in URLs
        // Note: Removed '-' from this list to properly handle repeated dashes
        ['/', '.', '=', '%', '+', '_', '&', '?'].includes(char) ||
        // If the count is unreasonably large (likely part of a URL)
        count > 50 ||
        // If we're in the middle of what looks like a URL path or query parameter
        (j < str.length && ['/', '.', '=', '&', '?', '%'].includes(str[j]));

      if (!isLikelyPartOfUrl) {
        result += char.repeat(count);
        i = j; // Skip the digits
      } else {
        // If it looks like part of a URL, treat as literal
        result += char + countStr;
        i = j;
      }
    } else {
      result += char;
      if (countStr) {
        result += countStr;
        i = j;
      }
    }
  }

  return result;
}

/**
 * Obfuscate a string using the character mapping
 * @param {string} str - The string to obfuscate
 * @returns {string} - The obfuscated string
 */
function obfuscate(str) {
  return str.split('').map(char => CHAR_MAP.encode[char] || char).join('');
}

/**
 * Deobfuscate a string using the character mapping
 * @param {string} str - The obfuscated string
 * @returns {string} - The deobfuscated string
 */
function deobfuscate(str) {
  return str.split('').map(char => CHAR_MAP.decode[char] || char).join('');
}

/**
 * Encode a URL for sharing
 * @param {string} url - The URL to encode
 * @returns {string} - The encoded URL
 */
export function encodeUrl(url) {
  // Skip compression to ensure character-for-character preservation
  // Just obfuscate the URL directly
  const obfuscated = obfuscate(url);

  // Make sure it's URL-safe by encoding any remaining special characters
  return encodeURIComponent(obfuscated);
}

/**
 * Decode an encoded URL
 * @param {string} encodedUrl - The encoded URL
 * @returns {string} - The original URL
 */
export function decodeUrl(encodedUrl) {
  // URL-decode, then deobfuscate
  // Skip decompression to ensure character-for-character preservation
  const decoded = decodeURIComponent(encodedUrl);
  const deobfuscated = deobfuscate(decoded);
  return deobfuscated;
}

/**
 * Generate a shareable URL for the given original URL
 * @param {string} originalUrl - The original URL to share
 * @returns {string} - The shareable URL
 */
export function generateShareableUrl(originalUrl) {
  const encodedUrl = encodeUrl(originalUrl);
  // Use the current origin or a default if not available
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/r/${encodedUrl}`;
}

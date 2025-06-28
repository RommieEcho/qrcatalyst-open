// @ts-nocheck
const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE62_MAP = Object.fromEntries(
  BASE62_CHARS.split('').map((char, index) => [char, index])
);

/**
 * Convert BigInt to base62 string
 * @param {BigInt} num 
 * @returns {string}
 */
function bigIntToBase62(num) {
  if (num === 0n) return '0';
  
  let result = '';
  let n = num < 0n ? -num : num; // Handle negative numbers
  
  while (n > 0n) {
    result = BASE62_CHARS[Number(n % 62n)] + result;
    n = n / 62n;
  }
  
  return num < 0n ? '-' + result : result;
}

/**
 * Convert base62 string to BigInt
 * @param {string} str 
 * @returns {BigInt}
 */
function base62ToBigInt(str) {
  if (!str || str === '0') return 0n;
  
  const isNegative = str.startsWith('-');
  const cleanStr = isNegative ? str.slice(1) : str;
  
  let result = 0n;
  const base = 62n;
  
  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr[i];
    const value = BASE62_MAP[char];
    
    if (value === undefined) {
      throw new Error(`Invalid base62 character: ${char}`);
    }
    
    result = result * base + BigInt(value);
  }
  
  return isNegative ? -result : result;
}

// Helper functions for hex conversion
function hexToBase62(hex) {
  if (!hex) return '0';
  const num = BigInt('0x' + hex);
  return bigIntToBase62(num);
}

function base62ToHex(base62) {
  if (!base62 || base62 === '0') return '0';
  const num = base62ToBigInt(base62);
  const hex = num.toString(16);
  // Ensure even length for proper byte conversion
  return hex.length % 2 ? '0' + hex : hex;
}

function testConversions() {
  const testCases = [
    '0',
    'ff',
    'deadbeef',
    '123456789abcdef0',
    'a1b2c3d4e5f67890123456789abcdef0123456789abcdef'
  ];
  
  console.log('Testing hex to base62 conversions:');
  testCases.forEach(hex => {
    const base62 = hexToBase62(hex);
    const backToHex = base62ToHex(base62);
    const match = hex.toLowerCase() === backToHex.toLowerCase();
    
    console.log(`${hex} → ${base62} → ${backToHex} ${match ? '✓' : '✗'}`);
    console.log(`Length: ${hex.length} → ${base62.length} (${Math.round((1 - base62.length/hex.length) * 100)}% shorter)`);
  });
}

export { bigIntToBase62, base62ToBigInt, hexToBase62, base62ToHex };
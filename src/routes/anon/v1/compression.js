// Base 62 character set: 0-9, a-z, A-Z
const BASE_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = BASE_CHARS.length;

/**
 * Encode a Uint8Array to base 62 string
 * @param {Uint8Array} uint8Array - The array to encode
 * @returns {string} Base 62 encoded string
 */
function encodeToBase62(uint8Array) {
    if (uint8Array.length === 0) return '';
    
    // Convert Uint8Array to BigInt
    let num = 0n;
    for (let i = 0; i < uint8Array.length; i++) {
        num = num * 256n + BigInt(uint8Array[i]);
    }
    
    // Handle zero case
    if (num === 0n) return '0';
    
    // Convert to base 62
    let result = '';
    while (num > 0n) {
        result = BASE_CHARS[Number(num % BigInt(BASE))] + result;
        num = num / BigInt(BASE);
    }
    
    return result;
}

/**
 * Decode a base 62 string back to Uint8Array
 * @param {string} base62String - The base 62 string to decode
 * @returns {Uint8Array} The decoded array
 */
function decodeFromBase62(base62String) {
    if (base62String === '') return new Uint8Array(0);
    if (base62String === '0') return new Uint8Array([0]);
    
    // Convert base 62 string to BigInt
    let num = 0n;
    for (let i = 0; i < base62String.length; i++) {
        const char = base62String[i];
        const value = BASE_CHARS.indexOf(char);
        if (value === -1) {
            throw new Error(`Invalid base 62 character: ${char}`);
        }
        num = num * BigInt(BASE) + BigInt(value);
    }
    
    // Convert BigInt back to Uint8Array
    const bytes = [];
    while (num > 0n) {
        bytes.unshift(Number(num % 256n));
        num = num / 256n;
    }
    
    return new Uint8Array(bytes);
}

export { encodeToBase62, decodeFromBase62 };
// @ts-nocheck
// XORCipher with Key Generation (seed) and Chaining
import { bigIntToBase62, base62ToBigInt } from './base62.js';

class SecureSeed {
  constructor(seed) {
    this.seedBuffer = new TextEncoder().encode(seed.toString());
    this.counter = 0;
    this.buffer = new Uint8Array();
  }

  async nextBytes(length) {
    const hmacKey = await crypto.subtle.importKey(
      'raw',
      this.seedBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const counterBuffer = new DataView(new ArrayBuffer(4));
    counterBuffer.setUint32(0, this.counter++);
    
    const hmac = await crypto.subtle.sign(
      'HMAC',
      hmacKey,
      counterBuffer.buffer
    );
    
    this.buffer = new Uint8Array(hmac);
    return this.buffer.slice(0, length);
  }
}

// Updated hashString using Web Crypto
async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .reduce((acc, byte) => acc * 256n + BigInt(byte), 0n);
}

const XORCipher = {
  encode (key, plaintext) {
      const bin = xor_encrypt(key, plaintext);
      const hex = Array.from(bin, (b)=>b.toString(16).padStart(2, '0')).join('');
      return hex;
  },
  decode (key, hexString) {
      const hexes = hexString.match(/.{2}/g);
      const bin = Uint8Array.from(hexes, (byte)=>parseInt(byte, 16));
      return xor_decrypt(key, bin);
  },
  
  async generateKeyFromSeed(seed, length) {
    const numericSeed = typeof seed === 'string' ? await hashString(seed) : BigInt(seed);
    const seedGen = new SecureSeed(numericSeed.toString());
    let keyBytes = new Uint8Array(length);
    let bytesFilled = 0;
    
    // Use HKDF-like expansion
    while (bytesFilled < length) {
      const bytes = await seedGen.nextBytes(32);
      const chunk = bytes.slice(0, length - bytesFilled);
      keyBytes.set(chunk, bytesFilled);
      bytesFilled += chunk.length;
    }
    
    // Convert to binary string format maintaining full entropy
    return String.fromCharCode.apply(null, keyBytes);
  },
  
  // Simple string hashing for seed conversion
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  },
  
  async encodeChained(key, plaintext) {
    // Generate random 12-byte IV (96 bits - same as AES-GCM recommendation)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const bin = xor_encrypt_chained(key, plaintext, iv);
    
    // Prepend IV to ciphertext (IV + ciphertext)
    const combined = new Uint8Array(iv.length + bin.length);
    combined.set(iv);
    combined.set(bin, iv.length);
    
    return Array.from(combined, b => b.toString(16).padStart(2, '0')).join('');
  },
  
  async decodeChained(key, hexString) {
    const bytes = Uint8Array.from(hexString.match(/.{2}/g), byte => 
      parseInt(byte, 16)
    );
    
    // Extract IV (first 12 bytes) and ciphertext
    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);
    
    return xor_decrypt_chained(key, ciphertext, iv);
  },
  
  // Updated helper methods
  async encodeSeededChained(seed, plaintext) {
    const key = await this.generateKeyFromSeed(seed, plaintext.length);
    return this.encodeChained(key, plaintext);
  },
  
  async decodeSeededChained(seed, hexString, plaintextLength) {
    const key = await this.generateKeyFromSeed(seed, plaintextLength);
    return this.decodeChained(key, hexString);
  }
};

// Handle both strings and buffers
function keyCharAt(key, i) {
  if (typeof key === 'string') {
    return key.charCodeAt(Math.floor(i % key.length));
  }
  // Handle ArrayBuffer/Uint8Array case
  return key[Math.floor(i % key.length)];
}

function xor_encrypt(key, plaintext) {
  const bin = new Uint8Array(plaintext.length);
  for(let i = 0; i < plaintext.length; i++){
      bin[i] = plaintext.charCodeAt(i) ^ keyCharAt(key, i);
  }
  return bin;
}

function xor_decrypt(key, bin) {
  return Array.from(bin, (c, i)=>String.fromCharCode(c ^ keyCharAt(key, i))).join('');
}

function xor_encrypt_chained(key, plaintext, iv) {
  const bin = new Uint8Array(plaintext.length);
  let previousCipher = iv[iv.length - 1] || 0; // Use last byte of IV as initial state
  
  for(let i = 0; i < plaintext.length; i++){
    const keyChar = keyCharAt(key, i);
    const plaintextChar = plaintext.charCodeAt(i);
    
    // XOR with key, IV byte (for first block), and previous cipher byte
    const ivByte = i < iv.length ? iv[i] : 0;
    bin[i] = plaintextChar ^ keyChar ^ ivByte ^ previousCipher;
    previousCipher = bin[i];
  }
  return bin;
}

function xor_decrypt_chained(key, bin, iv) {
  let result = '';
  let previousCipher = iv[iv.length - 1] || 0;
  
  for(let i = 0; i < bin.length; i++){
    const keyChar = keyCharAt(key, i);
    const cipherChar = bin[i];
    
    // XOR with key, IV byte, and previous cipher byte
    const ivByte = i < iv.length ? iv[i] : 0;
    const plaintextChar = cipherChar ^ keyChar ^ ivByte ^ previousCipher;
    result += String.fromCharCode(plaintextChar);
    previousCipher = cipherChar;
  }
  return result;
}

// Update example usage with async/await
async function exampleUsage() {
  const plaintext = 'http://qrc.site/anon?q=7KdtmTs3KOWmQIPn03iAeu3xgcqaZPmC1lgZtTcL5J3US0k9RyMTPN2sMc';
  const password = '42 is the answer';

  // Original method
  const encoded = XORCipher.encode(password, plaintext);
  console.log('Original E:', encoded.slice(0, 50));
  console.log('Original D:', XORCipher.decode(password, encoded));
  console.log('Wrong PW D:', (XORCipher.decode('Wrong', encoded)).trim(), '\n');

  // Seeded key generation 32 bytes = 256 bit equivalent
  const seededKey = await XORCipher.generateKeyFromSeed(password, 32);
  
  // Chained encryption with proper IV
  const chainedEncoded = await XORCipher.encodeChained(seededKey, plaintext);
  console.log('Chained E: ', chainedEncoded.slice(0, 50));
  console.log('Chained D: ', await XORCipher.decodeChained(seededKey, chainedEncoded), '\n');

  // Seeded + Chained
  const seededChainedEncoded = await XORCipher.encodeSeededChained(seededKey, plaintext);
  console.log('Seed+Cha E:', seededChainedEncoded.slice(0, 50));
  console.log('Seed+Cha D:', await XORCipher.decodeSeededChained(seededKey, seededChainedEncoded, plaintext.length));
}

// Run the example
// exampleUsage().catch(console.error);

function hexToBase62(hex) {
  const num = BigInt('0x' + hex);
  return bigIntToBase62(num);
}

function base62ToHex(base62) {
  const num = base62ToBigInt(base62);
  return num.toString(16);
}

/**
 * 
 * @param {string} password 
 * @param {string} plaintext 
 * @returns {Promise<string>}
 */
async function encrypt(password, plaintext) {
  const hexResult = await XORCipher.encodeSeededChained(password, plaintext);
  return hexToBase62(hexResult);
}

/**
 * 
 * @param {string} password 
 * @param {string} base62String 
 * @returns {Promise<string>}
 */
async function decrypt(password, base62String) {
  const hexString = base62ToHex(base62String);
  const plaintextLength = (hexString.length / 2) - 12; // Calculate from IV overhead
  return XORCipher.decodeSeededChained(password, hexString, plaintextLength);
}

export { encrypt, decrypt };
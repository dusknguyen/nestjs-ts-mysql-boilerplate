import * as argon2 from 'argon2';
import { nanoid } from 'nanoid';

/**
 * Argon2 hashing configuration.
 * https://github.com/ranisalt/node-argon2/wiki/Options
 */
const argon2Config: argon2.Options = {
  type: argon2.argon2id, // Argon2id variant, secure and resistant to side-channel attacks
  memoryCost: 2 ** 11, // Memory cost (increased for stronger security)
  timeCost: 10, // Time cost (increases hashing time for security)
  parallelism: 2, // Number of threads to run in parallel
  hashLength: 32, // Length of the resulting hash (256 bits)
  secret: Buffer.from('mysecret'), // Secret used for additional security (adds key derivation factor)
  associatedData: Buffer.from(`${nanoid()}`), // Adds associated data (useful for nonces)
};

/**
 * Hashes the provided password using Argon2.
 *
 * @param password The plaintext password to be hashed.
 * @returns The hashed password string or null if an error occurred.
 */
export async function hashPassword(password: string): Promise<string | null> {
  try {
    // Hash the password using the defined Argon2 configuration
    const hash = await argon2.hash(password, argon2Config);
    return hash;
  } catch (err) {}
  return null;
}

/**
 * Verifies if the provided password matches the stored hash.
 *
 * @param hash The stored hash.
 * @param password The plaintext password to check against the hash.
 * @returns True if the password matches, false otherwise.
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    // Verify if the provided password matches the stored hash with the secret for additional security
    const isMatch = await argon2.verify(hash, password, { secret: Buffer.from('mysecret') });
    return isMatch;
  } catch (err) {}
  return false;
}

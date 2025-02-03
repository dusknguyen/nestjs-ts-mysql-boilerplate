import forge from 'node-forge';

/**
 * Hashes the input data using SHA-512.
 *
 * @param data The string to be hashed.
 * @returns The SHA-512 hash of the input data, represented as a hexadecimal string.
 */
export const hash512 = (data: string): string => {
  // Create a SHA-512 hash instance using node-forge
  return forge.md.sha512
    .create()
    .update(data) // Update the hash with the provided data
    .digest() // Finalize the hash calculation
    .toHex(); // Convert the hash result to a hexadecimal string
};
/**
 * Hashes the input data using SHA-256.
 *
 * @param data The string to be hashed.
 * @returns The SHA-256 hash of the input data, represented as a hexadecimal string.
 */
export const hash256 = (data: string): string => {
  // Create a SHA-256 hash instance using node-forge
  return forge.md.sha256
    .create()
    .update(data) // Update the hash with the provided data
    .digest() // Finalize the hash calculation
    .toHex(); // Convert the hash result to a hexadecimal string
};

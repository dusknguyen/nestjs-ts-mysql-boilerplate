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

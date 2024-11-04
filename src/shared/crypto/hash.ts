import { BadGatewayException } from '@nestjs/common';
import CryptoJS from 'crypto-js';
import argon2 from 'argon2';
import randomBytes from 'randombytes';
/**
 * @param {string} data - The plain text to encrypt.
 * @returns {string} - The encrypted data
 */
export function hash512(data: string): string {
  const hash = CryptoJS.SHA512(data);
  return hash.toString(CryptoJS.enc.Hex);
}
/**
 *
 */
export function hash256(data: string): string {
  const hash = CryptoJS.SHA256(data);
  return hash.toString(CryptoJS.enc.Hex);
}
/**
 *
 */
export async function hashPassword(text: string): Promise<string> {
  try {
    const salt = randomBytes(16);
    const secret = randomBytes(32);
    const associatedData = randomBytes(16);
    const saltBase64 = salt.toString('base64');
    const secretBase64 = secret.toString('base64');
    const associatedDataBase64 = associatedData.toString('base64');
    const hashed: string = await argon2.hash(hash256(text), {
      type: argon2.argon2id,
      hashLength: 32,
      timeCost: 3,
      memoryCost: 2 ** 16,
      parallelism: 1,
      salt: Buffer.from(saltBase64, 'base64'),
      secret: Buffer.from(secretBase64, 'base64'),
      associatedData: Buffer.from(associatedDataBase64, 'base64'),
    });
    return hashed;
  } catch (e) {
    throw new BadGatewayException(e);
  }
}
// argon2 for comparing passwords
/**
 *
 */
export async function comparePassword(password: string, oldPassword?: string): Promise<boolean> {
  try {
    if (password && oldPassword) {
      const passwordEqual: boolean = await argon2.verify(oldPassword, hash256(password));
      return passwordEqual;
    }
    return false;
  } catch {
    return false;
  }
}

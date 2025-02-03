/// <reference types='node' />

import { FastifyPluginCallback } from 'fastify';

declare module 'fastify' {
  // Extending FastifyInstance with methods related to cookie serialization and signing
  interface FastifyInstance extends SignerMethods {
    /**
     * Serializes a cookie name-value pair into a Set-Cookie header string.
     * @param name Cookie name (e.g., 'sessionId')
     * @param value Cookie value (e.g., 'abcd1234')
     * @param opts Options to control cookie serialization (e.g., domain, path, secure)
     * @returns A properly formatted Set-Cookie header string
     * @throws {TypeError} If the maxAge option is invalid (must be a number)
     */
    serializeCookie(name: string, value: string, opts?: fastifyCookie.SerializeOptions): string;

    /**
     * Parses a raw cookie header into a dictionary of cookie names and values.
     * @docs https://github.com/fastify/fastify-cookie#manual-cookie-parsing
     * @param cookieHeader Raw cookie header value (e.g., 'sessionId=abcd1234; token=xyz567')
     * @returns An object where keys are cookie names and values are cookie values
     */
    parseCookie(cookieHeader: string): {
      [key: string]: string;
    };
  }

  // Extending FastifyRequest with cookie parsing methods
  interface FastifyRequest extends SignerMethods {
    /**
     * Request cookies as a dictionary (name: value) from the request header
     * Can be accessed to retrieve cookies sent by the client
     */
    cookies: { [cookieName: string]: string | undefined };
  }

  // Extending FastifyReply with methods to set, clear, and unsign cookies in responses
  interface FastifyReply extends SignerMethods {
    /**
     * Response cookies as a dictionary (name: value) that can be set or cleared
     */
    cookies: { [cookieName: string]: string | undefined };
  }

  // SignerMethods: Methods for signing and unsigning cookies with a secret
  interface SignerMethods {
    /**
     * Signs the specified cookie value using the provided secret or signer.
     * @param value Cookie value (e.g., 'sessionId=abcd1234')
     * @returns A signed cookie value
     */
    signCookie(value: string): string;

    /**
     * Unsigns the specified cookie value to verify its integrity.
     * @param value The signed cookie value (e.g., 'sessionId=abcd1234')
     * @returns UnsignResult indicating whether the cookie is valid and optionally renewing it
     */
    unsignCookie(value: string): fastifyCookie.UnsignResult;
  }

  // Type for setting cookies in responses
  export type setCookieWrapper = (name: string, value: string, options?: fastifyCookie.CookieSerializeOptions) => FastifyReply;

  // Extending FastifyReply to include setCookie and clearCookie methods for managing cookies
  interface FastifyReply {
    /**
     * Sets a cookie in the response with optional serialization options.
     * @param name Cookie name
     * @param value Cookie value
     * @param options Cookie serialization options (e.g., expires, httpOnly, maxAge)
     */
    setCookie: setCookieWrapper;

    /**
     * Alias for `setCookie`.
     * @param name Cookie name
     * @param value Cookie value
     * @param options Cookie serialization options
     */
    cookie(name: string, value: string, options?: fastifyCookie.CookieSerializeOptions): this;

    /**
     * Clears a specific cookie from the response by setting the expiration to a past date.
     * @param name Cookie name
     * @param options Cookie serialization options (e.g., path, domain)
     */
    clearCookie(name: string, options?: fastifyCookie.CookieSerializeOptions): this;

    /**
     * Unsigns a cookie to check its integrity using the provided secret.
     * @param value Signed cookie value
     * @returns UnsignResult indicating validity of the cookie
     */
    unsignCookie(value: string): fastifyCookie.UnsignResult;
  }
}

// FastifyPluginCallback type for fastify-cookie plugin
type FastifyCookiePlugin = FastifyPluginCallback<NonNullable<fastifyCookie.FastifyCookieOptions>>;

declare namespace fastifyCookie {
  // SignerBase interface to handle signing and unsigning cookies
  interface SignerBase {
    sign: (value: string) => string; // Method to sign a cookie value
    unsign: (input: string) => UnsignResult; // Method to unsign a cookie value
  }

  // Signer class to create cookie signers with a secret
  export class Signer implements SignerBase {
    constructor(secrets: string | Array<string> | Buffer | Array<Buffer>, algorithm?: string);
    sign: (value: string) => string;
    unsign: (input: string) => UnsignResult;
  }

  // Options for serializing cookies
  export interface SerializeOptions {
    domain?: string; // Domain for the cookie
    encode?(val: string): string; // Custom encoding function for cookie value
    expires?: Date; // Expiration date for the cookie
    httpOnly?: boolean; // Whether the cookie is accessible only via HTTP(S) (not JS)
    maxAge?: number; // Max age in seconds for the cookie
    partitioned?: boolean; // Whether the cookie is partitioned
    path?: string; // Path for which the cookie is valid
    sameSite?: 'lax' | 'none' | 'strict' | boolean; // SameSite policy for the cookie
    priority?: 'low' | 'medium' | 'high'; // Priority for eviction
    secure?: boolean; // Whether the cookie is transmitted over HTTPS only
  }

  // Options for serializing cookies with additional settings like signed cookies
  export interface CookieSerializeOptions extends Omit<SerializeOptions, 'secure'> {
    secure?: boolean | 'auto'; // Automatically apply secure flag based on HTTPS
    signed?: boolean; // Whether the cookie should be signed
  }

  // Options for parsing cookies with an optional custom decode function
  export interface ParseOptions {
    decode?: (encodedURIComponent: string) => string; // Custom decode function for cookies
  }

  // Hook types for Fastify lifecycle events
  type HookType = 'onRequest' | 'preParsing' | 'preValidation' | 'preHandler' | 'preSerialization';

  // Sign and unsign utility functions for cookies
  export type Sign = (value: string, secret: string | Buffer, algorithm?: string) => string;
  export type Unsign = (input: string, secret: string | Buffer, algorithm?: string) => UnsignResult;
  export type SignerFactory = (secrets: string | string[] | Buffer | Buffer[], algorithm?: string) => SignerBase;

  // Result of unsigning a cookie
  export type UnsignResult =
    | { valid: true; renew: boolean; value: string } // Valid cookie
    | { valid: false; renew: false; value: null }; // Invalid cookie

  // Utility methods for signing and unsigning cookies
  export const signerFactory: SignerFactory;
  export const sign: Sign;
  export const unsign: Unsign;

  // Main interface for the fastify-cookie plugin
  export interface FastifyCookie extends FastifyCookiePlugin {
    parse: (cookieHeader: string, opts?: ParseOptions) => { [key: string]: string }; // Method to parse cookie header
    serialize: (name: string, value: string, opts?: SerializeOptions) => string; // Method to serialize cookie
    signerFactory: SignerFactory; // Factory for creating cookie signers
    Signer: Signer; // Signer class for cookie signing
    sign: Sign; // Method to sign cookies
    unsign: Unsign; // Method to unsign cookies
  }

  export const fastifyCookie: FastifyCookie;

  // Configuration options for the fastify-cookie plugin
  export interface FastifyCookieOptions {
    secret?: string | string[] | Buffer | Buffer[] | Signer | SignerBase; // Secret for signing cookies
    algorithm?: string; // Algorithm for signing cookies
    hook?: HookType | false; // Lifecycle hook for cookie processing
    parseOptions?: CookieSerializeOptions; // Options for parsing cookies
  }

  // Default export for fastify-cookie plugin
  export { fastifyCookie as default };
}

// Fastify-cookie plugin function declaration
declare function fastifyCookie(...params: Parameters<FastifyCookiePlugin>): ReturnType<FastifyCookiePlugin>;

export = fastifyCookie;

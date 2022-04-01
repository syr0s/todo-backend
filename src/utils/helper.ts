import crypto from 'crypto';

/**
 * Interprets a passed in string `val` to boolean.
 * Typically used for any boolean value provided 
 * through `dotenv`.
 * @param val 
 * @returns 
 */
export function toBoolean(val: string | undefined) {
	if (val == 'true') {
		return true;
	}
	return false;
}

/**
 * Creates a random string of a given size.
 * @param length 
 * @returns 
 */
export function randomString(length: number): string {
	return crypto.randomBytes(length)
		.toString('hex')
		.slice(0, length);
}
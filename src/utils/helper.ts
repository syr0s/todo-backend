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
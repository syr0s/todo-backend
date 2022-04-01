import { RSA } from '../utils/rsa';
import log4js from 'log4js';

export interface IToken {
    /**
     * `RSA` object to interact with.
     */
    rsa: RSA;
    /**
     * `EventLogger` to interact with.
     */
    logger: log4js.Logger;
    /**
     * Create a new token
     */
    create(uuid: string): string;
    /**
     * Validate a given token
     */
    validate(token: string): boolean;
}
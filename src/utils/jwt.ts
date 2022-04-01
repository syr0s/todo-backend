import log4js from 'log4js';
import jwt from 'jsonwebtoken';
import { IToken } from '../interface/token';
import { EventLogger } from './logger';
import { RSA } from './rsa';
import { ITokenData } from '../interface/token_data';

export class Jwt implements IToken {
	public rsa: RSA;
	public logger: log4js.Logger;
	public uuid?: string;
	public token?: string;

	private options: jwt.SignOptions;
	private expiry = 86400000 * 30;

	constructor() {
		this.rsa = new RSA();
		this.logger = new EventLogger(Jwt.name).logger;
		this.options = {
			algorithm: 'RS256'
		};
	}

	/**
     * Create a new `jsonwebtoken`.
     * @param uuid 
     * @returns 
     */
	create(uuid: string): string {
		this.logger.debug(`Creating new token for UUID: ${uuid}`);
		const payload: ITokenData = {
			uuid: uuid,
			timestamp: Date.now(),
		};
		const secret: jwt.Secret = {
			key: String(this.rsa.privateKey),
			passphrase: String(this.rsa.config.privateKeyEncoding.passphrase),
		};
		const token = jwt.sign(payload, secret, this.options);
		this.logger.debug(`Created token: ${token}`);
		return token;
	}

	/**
     * Checks if a token is set in the authentication header. Will store it
     * to the token property if set.
     * @param authHeader 
     * @returns 
     */
	public getToken(authHeader: string | undefined) {
		if (authHeader) {
			this.token = authHeader.split(' ')[1];
			return true;
		}
		return false;
	}

	/**
     * Validate a given `jsonwebtoken`.
     * @param token 
     * @returns 
     */
	validate(token: string): boolean {
		let verify: ITokenData = {
			uuid: '',
			timestamp: 0,
		};
		try {
			verify = jwt.verify(token, String(this.rsa.publicKey)) as ITokenData;
		} catch(error: unknown) {
			this.logger.warn('Provided json web token is invalid');
			return false;
		}
		
		if (verify.uuid.length > 0) {
			if (verify.timestamp + this.expiry > Date.now()) {
				this.logger.debug('Provided token is valid');
				this.uuid = verify.uuid;
				return true;
			} else {
				this.logger.warn('Provided json web token has expired');
				return false;
			}
		}
		this.logger.warn('Provided json web token is invalid');
		return false;
	}
}
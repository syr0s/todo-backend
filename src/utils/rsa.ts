import crypto from 'crypto';
import fs from 'fs';

import { config } from '../config';
import { IRsaConfig } from '../interface/config/rsa';

export class RSA {
	/** RSA default configuration */
	private config: IRsaConfig = config.rsa;

	/** Private key of the server */
	private privateKey?: string;

	/** Public key of the server */
	private publicKey?: string;

	/**
     * Creates a new `RSA` object and enrolls
     * the RSA keys from disk, if the server
     * has already generated them.
     */
	constructor() {
		this.readKeys();
	}

	/**
     * Generates a new set of RSA keys.
     */
	public generateKeys(): void {
		const keys: crypto.KeyPairKeyObjectResult = crypto.generateKeyPairSync('rsa', this.config);
		this.privateKey = String(keys.privateKey);
		this.publicKey = String(keys.publicKey);
		fs.writeFileSync(this.config.keyPath + 'private.pem', this.privateKey);
		fs.writeFileSync(this.config.keyPath + 'public.pem', this.publicKey);
	}

	/**
     * Checks if the passphrase, enrolled by the environment variable is valid to the stored
     * private key. Please make sure, you have loaded the keys from the filesystem.
     * @returns 
     */
	public checkPassphrase(): boolean {
		const plaintext = 'Test';
		if (this.privateKey == undefined || this.publicKey == undefined) {
			throw new Error('Keys not loaded!');
		}
		const encrypt = crypto.publicEncrypt(String(this.publicKey), Buffer.from(plaintext));
		try {
			crypto.privateDecrypt({
				key: String(this.privateKey),
				passphrase: String(this.config.privateKeyEncoding.passphrase),
			}, Buffer.from(encrypt));
		} catch(error) {
			return false;
		}
		return true;
	}

	/**
     * Reads the private and public key from the filesystem, in case they exists
     * both.
     */
	private readKeys(): void {
		const privatePath = this.config.keyPath + 'private.pem';
		const publicPath = this.config.keyPath + 'public.pem';
		if (fs.existsSync(privatePath)) {
			if (fs.existsSync(publicPath)) {
				this.privateKey = fs.readFileSync(privatePath).toString('utf-8');
				this.publicKey = fs.readFileSync(publicPath).toString('utf-8');
			}
		}
		
	}
}
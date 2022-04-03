import log4js from 'log4js';
import fs from 'fs';

import { config } from '../config';
import { IConfiguration } from '../interface/config';
import { EventLogger } from './logger';
import { RSA } from './rsa';
import { MongoDB } from './mongodb';
import { IServer } from '../interface/server';
import { ExpressServer } from './express_server';
import { Redis } from './redis';

/**
 * Creates a new `System`. This is typically done in the `main.ts` file.
 */
export class System {

	/**
     * Main configuration of the RESTful API
     */
	private config: IConfiguration = config;

	/**
     * `EventLogger` for the class.
     */
	private logger: log4js.Logger;

	/**
     * `RSA` service class.
     */
	private rsa: RSA = new RSA();

	/**
	 * `Express.js` server object.
	 */
	private expressServer: IServer = new ExpressServer();

	/**
	 * `MongoDB` service class.
	 */
	private mongo: MongoDB = new MongoDB();

	private redis: Redis;

	/**
     * Counts the number of warnings during the self-check up.
     */
	private warnCount = 0;

	constructor() {
		this.logger = new EventLogger(System.name).logger;
		this.redis = new Redis();
	}

	/**
     * Start the newly generated `System`.
     */
	public start(): void {
		this.checkConfig();
		this.mongo.connect();
		this.redis.connect();
		this.expressServer.start();
	}

	/**
     * Check the server configuration on startup.
     */
	private checkConfig(): void {
		this.logger.debug('Running self check on server start ...');
		this.checkDebug();
		this.checkConfigMongoDB();
		this.chechConfigRedis();
		this.checkConfigRSA();
		this.logger.info(`System check up finished with ${this.warnCount} warning(s).`);
	}

	/**
     * Check if the server runs in `DEBUG` mode.
     */
	private checkDebug(): void {
		if (this.config.server.debug) {
			this.logger.warn('Server is configured in DEBUG mode! Please change this in production environments!');
			this.warnCount += 1;
		}
	}

	/**
     * Check the provided MongoDB configuration
     */
	private checkConfigMongoDB(): void {
		this.logger.debug('Checking MongoDB configuration ...');

		// Fatal errors on configuration
		if (this.config.mongodb.host.length == 0) {
			throw new Error('No MongoDB host configured. Please provide a valid MongoDB hostname');
		}
		this.logger.debug(`MongoDB host set to ${this.config.mongodb.host}`);
		if (this.config.mongodb.port == null) {
			throw new Error('No MongoDB port configured. Please provide a valid MongoDB port');
		}
		this.logger.debug(`MongoDB port set to ${this.config.mongodb.port}`);
		if (this.config.mongodb.database.length == 0) {
			throw new Error('No MongoDB database configured. Please provide a valid MongoDB database name');
		}
		this.logger.debug(`MongoDB database set to ${this.config.mongodb.database}`);
		if (this.config.mongodb.username.length == 0) {
			throw new Error('No MongoDB username configured. Please provide a valid MongoDB username');
		}
		this.logger.debug(`MongoDB username set to ${this.config.mongodb.username}`);
		if (this.config.mongodb.password.length == 0) {
			throw new Error('No MongoDB password configured. Please provide a valid MongoDB password');
		}
		this.logger.debug('MongoDB password found');

		// Fatal errors on production systems only
		if (this.config.mongodb.database == 'todo-test') {
			if (!this.config.server.debug) {
				throw new Error('You are using the default MongoDB database. You have to change this value in production.');
			} else {
				this.logger.warn('You are using the default MongoDB database. You have to change this value in production.');
				this.warnCount += 1;
			}
		}
		if (this.config.mongodb.username == 'mongodb-test-user') {
			if (!this.config.server.debug) {
				throw new Error('You are using the default MongoDB username. You have to change this value in production.');
			} else {
				this.logger.warn('You are using the default MongoDB username. You have to change this value in production.');
				this.warnCount += 1;
			}
		}
		if (this.config.mongodb.password == 'testUserPassw0rd') {
			if (!this.config.server.debug) {
				throw new Error('You are using the default MongoDB password. You have to change this value in production.');
			} else {
				this.logger.warn('You are using the default MongoDB password. You have to change this value in production.');
				this.warnCount += 1;
			}
		}
		if (this.config.mongodb.password.length < 32) {
			if (!this.config.server.debug) {
				throw new Error('MongoDB password must be at least 32 characters long.');
			} else {
				this.logger.warn(`MongoDB password should have at least 32 characters, got ${this.config.mongodb.password.length}`);
				this.warnCount += 1;
			}
		}
		const pattern = new RegExp(
			'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$'
		);
		if (!pattern.test(this.config.mongodb.password)) {
			if (!this.config.server.debug) {
				throw new Error('MongoDB password has an invalid form. Requires at least one lower-, one upercase character, one number and one special character');
			} else {
				this.logger.warn('The MongoDB password should contain:');
				this.logger.warn('   - at least one lowercase character');
				this.logger.warn('   - at least one uppercase character');
				this.logger.warn('   - at least one numeric value');
				this.logger.warn('   - at least one special character');
				this.warnCount += 1;
			}
		}
	}

	/**
	 * Check the provided Redis configuration.
	 */
	private chechConfigRedis(): void {
		this.logger.debug('Checking Redis configuration ...');

		// Fatal errors on configuration
		if (this.config.redis.host.length == 0) {
			throw new Error('No Redis host configured. Please provide a valid Redis hostname');
		}
		this.logger.debug(`Redis host set to ${this.config.redis.host}`);
		if (this.config.redis.port == null) {
			throw new Error('No Redis port configured. Please provide a valid Redis port');
		}
		this.logger.debug(`Redis port set to ${this.config.redis.port}`);
		if (this.config.redis.password.length == 0) {
			throw new Error('No Redis password configured. Please provide a valid Redis password');
		}
		this.logger.debug('Redis password found');
		

		// Fatal errors on production systems only
		if (this.config.redis.password == 'defaultPassword') {
			if (!this.config.server.debug) {
				throw new Error('You are using the default password for the Redis instance');
			} else {
				this.logger.warn('You are using the default password for the Redis instance. Consider to change this in production');
				this.warnCount += 1;
			}
		}
		if (this.config.redis.password.length < 32) {
			if (!this.config.server.debug) {
				throw new Error('Redis password must be at least 32 characters long.');
			} else {
				this.logger.warn(`Redis password should have at least 32 characters, got ${this.config.redis.password.length}`);
				this.warnCount += 1;
			}
		}
		const pattern = new RegExp(
			'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$'
		);
		if (!pattern.test(this.config.redis.password)) {
			if (!this.config.server.debug) {
				throw new Error('Redis password has an invalid form. Requires at least one lower-, one upercase character, one number and one special character');
			} else {
				this.logger.warn('The Redis password should contain:');
				this.logger.warn('   - at least one lowercase character');
				this.logger.warn('   - at least one uppercase character');
				this.logger.warn('   - at least one numeric value');
				this.logger.warn('   - at least one special character');
				this.warnCount += 1;
			}
		}
	}

	/**
     * Check the provided RSA configuration.
     */
	private checkConfigRSA(): void {
		this.logger.debug('Checking RSA configuration ...');

		// Fatal errors on configuration
		if (this.config.rsa.privateKeyEncoding.passphrase == 'notSet') {
			throw new Error('No passphrase to encrypt the private key provided! Please set a passphrase');
		}

		// Fatal errors on production systems only
		if (this.config.rsa.privateKeyEncoding.passphrase.length < 256) {
			if (!this.config.server.debug) {
				throw new Error(`RSA encryption passphrase should have a length of at least 256 characters - got ${this.config.rsa.privateKeyEncoding.passphrase.length} characters.`);
			} else {
				this.logger.warn(`RSA encryption passphrase should have a length of at least 256 characters - got ${this.config.rsa.privateKeyEncoding.passphrase.length} characters.`);
				this.warnCount += 1;
			}
		} else {
			this.logger.debug('Found a valid RSA passphrase');
		}

		// Check RSA keys
		if (fs.existsSync(this.config.rsa.keyPath + '/private.pem')) {
			this.logger.debug('Found private key on server');
			if (fs.existsSync(this.config.rsa.keyPath + '/public.pem')) {
				this.logger.debug('Found public key on server');
				if (this.rsa.checkPassphrase()) {
					this.logger.debug('Passphrase is valid for private key');
				} else {
					this.logger.warn('Passphrase is invalid for the founded private key');
					this.logger.warn('Will create a new set of RSA keys ...');
					this.logger.warn('This means, that all tokens, signed by this API will become invalid!');
					this.warnCount += 1;
					this.rsa.generateKeys();
				}
			} else {
				this.logger.warn('Found a private key but not a public key. Will create a new set of RSA keys ...');
				this.logger.warn('This means, that all tokens, signed by this API will become invalid!');
				this.warnCount += 1;
				this.rsa.generateKeys();
			}
		} else {
			this.logger.warn('No private key found for server. Will create new set of RSA keys ...');
			this.warnCount += 1;
			if (!fs.existsSync(this.config.rsa.keyPath)) {
				this.logger.warn(`Directory ${this.config.rsa.keyPath} not found. Creating it ...`);
				this.warnCount += 1;
				fs.mkdirSync(this.config.rsa.keyPath);
			}
			this.rsa.generateKeys();
		}	
	}
}
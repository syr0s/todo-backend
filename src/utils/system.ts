import log4js from 'log4js';
import { config } from '../config';
import { IConfiguration } from '../interface/config';
import { EventLogger } from './logger';

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
	private logger: log4js.Logger = new EventLogger(System.name).logger;

	/**
     * Counts the number of warnings during the self-check up.
     */
	private warnCount = 0;

	/**
     * Start the newly generated `System`.
     */
	public start(): void {
		this.checkConfig();
	}

	/**
     * Check the server configuration on startup.
     */
	private checkConfig(): void {
		this.logger.debug('Running self check on server start ...');
		this.checkDebug();
		this.checkConfigMongoDB();
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
		// Fatal errors on configuration
		this.logger.debug('Checking MongoDB configuration ...');
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
	}

	/**
     * Check the provided RSA configuration
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
		// TODO Warnings on configuration
		// TODO Check for existing keys
		// TODO Check if passphrase matches the private key
	}
}
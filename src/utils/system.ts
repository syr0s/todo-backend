import { config } from '../config';
import { IConfiguration } from '../interface/config';
export class System {

	/**
     * Main configuration of the RESTful API
     */
	private config: IConfiguration = config;

	/**
     * Create a new `System`.
     */
	constructor() {
		this.checkConfig();
	}

	/**
     * Check the server configuration on startup.
     */
	private checkConfig(): void {
		this.checkDebug();
		this.checkConfigMongoDB();
		this.checkConfigRSA();
	}

	/**
     * Check if the server runs in `DEBUG` mode.
     */
	private checkDebug(): void {
		if (this.config.server.debug) {
			console.log('Warning this server runs in DEBUG mode, this is totaly fine in development environments. Please set DEBUG to false on production systems!');
		}
	}

	/**
     * Check the provided MongoDB configuration
     */
	private checkConfigMongoDB(): void {
		// Fatal errors on configuration
		if (this.config.mongodb.host.length == 0) {
			throw new Error('No MongoDB host configured. Please provide a valid MongoDB hostname');
		}
		if (this.config.mongodb.port == null) {
			throw new Error('No MongoDB port configured. Please provide a valid MongoDB port');
		}
		if (this.config.mongodb.database.length == 0) {
			throw new Error('No MongoDB database configured. Please provide a valid MongoDB database name');
		}
		if (this.config.mongodb.username.length == 0) {
			throw new Error('No MongoDB username configured. Please provide a valid MongoDB username');
		}
		if (this.config.mongodb.password.length == 0) {
			throw new Error('No MongoDB password configured. Please provide a valid MongoDB password');
		}
		// Fatal errors on production systems only
		if (!this.config.server.debug) {
			if (this.config.mongodb.database == 'todo-test') {
				throw new Error('You are using the default MongoDB database. You have to change this value in production.');
			}
			if (this.config.mongodb.username == 'mongodb-test-user') {
				throw new Error('You are using the default MongoDB username. You have to change this value in production.');
			}
			if (this.config.mongodb.password == 'testUserPassw0rd') {
				throw new Error('You are using the default MongoDB password. You have to change this value in production.');
			}
		}
	}

	/**
     * Check the provided RSA configuration
     */
	private checkConfigRSA(): void {
		// Fatal errors on configuration
		if (this.config.rsa.privateKeyEncoding.passphrase == 'notSet') {
			throw new Error('No passphrase to encrypt the private key provided! Please set a passphrase');
		}
		// Fatal errors on production systems only
		if (!this.config.server.debug) {
			if (this.config.rsa.privateKeyEncoding.passphrase.length == 0) {
				throw new Error('No passphrase to encrypt the private key provided! Please set a passphrase');
			}
		}
		// TODO Warnings on configuration
		// TODO Check for existing keys
		// TODO Check if passphrase matches the private key
	}
}
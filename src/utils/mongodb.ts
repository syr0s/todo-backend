import log4js from 'log4js';
import mongoose from 'mongoose';

import { config } from '../config';
import { IMongodbConfig } from '../interface/config/mongodb';
import { EventLogger } from './logger';

export class MongoDB {
	/** `EventLogger` */
	private logger: log4js.Logger;
	/** MongoDB configuration */
	private config: IMongodbConfig = config.mongodb;
	/** URI to connect to the MongoDB instance. */
	private uri: string;
	/** MongoDB connection options. */
	private options:mongoose.ConnectOptions;

	/**
     * Creates a new `MongoDB` object, using the the default
     * configuration.
     */
	constructor() {
		this.logger = new EventLogger(MongoDB.name).logger;
		this.uri = `mongodb://${this.config.host}:${this.config.port}`;
		this.options = {
			dbName: this.config.database,
			// required to re-establish a broken connection
			socketTimeoutMS: 3000, 
			// required to re-establish a broken connection
			connectTimeoutMS: 3000,
			auth: {
				username: this.config.username,
				password: this.config.password
			}
		};
	}

	/**
     * Connect the RESTful API to the MongoDB instance.
     */
	public connect(): void {
		const connection = mongoose.connection;
		connection.on('connected', () => {
			this.logger.info('MongoDB connection established');
		});
		connection.on('reconnected', () => {
			this.logger.info('MongoDB connection reestablished');
		});
		connection.on('disconnected', () => {
			this.logger.warn('MongoDB connection disconnected!');
			this.logger.warn(`Try to reestablish the connection at ${this.config.host}:${this.config.port}`);
			setTimeout(() => {
				mongoose.connect(this.uri, this.options);
			}, 3000);
		});

		const run = async () => {
			this.logger.info(`Try to connect to MongoDB at ${this.config.host}:${this.config.port}`);
			await mongoose.connect(this.uri, this.options);
		};
		run().catch(error => this.logger.error(error));
	}
}
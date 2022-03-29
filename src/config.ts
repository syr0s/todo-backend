/**
 * This file loads and stores the main configuration of the RESTful API.
 * Please consult the documentation, befor you change any values directly
 * in this file. Use the `.env` file instead.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author Daniel Noetzel <daniel.noetzel@gmai.com>
 * 
 */

import dotenv from 'dotenv';
import { IConfiguration } from './interface/config';
import { toBoolean } from './utils/helper';

dotenv.config();

/** Main configuration of the RESTful API */
export const config: IConfiguration = {
	server: {
		port: 3000,
		baseDir: __dirname,
		debug: toBoolean(process.env.DEBUG) || false,
	},
	mongodb: {
		host: process.env.MONGODB_HOST || 'localhost',
		port: Number(process.env.MONGODB_PORT) || 27017,
		database: process.env.MONGODB_DATABASE || 'todo-test',
		username: process.env.MONGODB_USERNAME || 'mongodb-test-user',
		password: process.env.MONGODB_PASSWORD || 'testUserPassw0rd',
	},
	cors: {
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		optionsSuccessStatus: 204,
	},
	rsa: {
		type: 'rsa',
		modulusLength: 4096,
		publicKeyEncoding: {
			type: 'spki',
			format: 'pem',
		},
		privateKeyEncoding: {
			type: 'pkcs8',
			format: 'pem',
			cipher: 'aes-256-cbc',
			passphrase: process.env.RSA_PASSPHRASE || 'notSet',
		},
		keyPath: __dirname + '/' + process.env.RSA_PATH_TO_KEYS || `${__dirname}/.keys/`,
	}
};

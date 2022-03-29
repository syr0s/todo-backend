import { ICorsConfig } from './config/cors';
import { IMongodbConfig } from './config/mongodb';
import { IRsaConfig } from './config/rsa';
import { IServerConfig } from './config/server';

/**
 * Configuration interface of the RESTful API.
 */
export interface IConfiguration {
    /**
     * Main `express.js` server configuration.
     */
    server: IServerConfig;

    /**
     * Main `MongoDB` server configuration.
     */
    mongodb: IMongodbConfig;

    /**
     * Main `cors` configuration.
     */
    cors: ICorsConfig;

    /**
     * `RSA` key configuration.
     */
    rsa: IRsaConfig;
}
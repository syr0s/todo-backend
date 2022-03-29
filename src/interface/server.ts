import log4js from 'log4js';
import { IServerConfig } from './config/server';

export interface IServer {
    /** Event logger */
    logger: log4js.Logger;
    /** Server configuration */
    config: IServerConfig;
    /** Configure te web server. */
    configure(): void;
    /** Configure the routing of the web server. */
    routes(): void;
    /** Start the web server. */
    start(): void;
}
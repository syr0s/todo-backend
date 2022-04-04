import log4js from 'log4js';
import express from 'express';
import cors from 'cors';
import compression from 'compression';

import { IServer } from '../interface/server';
import { EventLogger } from './logger';
import { IServerConfig } from '../interface/config/server';
import { config } from '../config';
import { ICorsConfig } from '../interface/config/cors';
import { RoutesAuth } from '../routes/auth';
import { IRoute } from '../interface/routes';
import { RoutesTodo } from '../routes/todo';

export class ExpressServer implements IServer {
	public logger: log4js.Logger;
	public config: IServerConfig = config.server;
	private app: express.Application;
	private corsConfig: ICorsConfig = config.cors;

	private routesAuth: IRoute = new RoutesAuth();
	private routesTodo: IRoute = new RoutesTodo();

	constructor() {
		this.logger = new EventLogger(ExpressServer.name).logger;
		this.app = express();
		this.configure();
		this.routes();
	}

	public configure(): void {
		this.logger.debug('Configure the express.js server ...');
		this.logger.debug(`Setting port to: ${this.config.port}`);
		this.logger.debug(`Using cors with configuration origin: ${this.corsConfig.origin}, methods: ${this.corsConfig.methods},`);
		this.logger.debug(`preflight continue: ${this.corsConfig.preflightContinue} and options success status: ${this.corsConfig.optionsSuccessStatus}`);
		this.app.set('port', this.config.port);
		this.app.use(cors(this.corsConfig));
		this.app.use(express.json());
		this.app.use(express.urlencoded({extended:false}));
		this.app.use(compression());
	}

	public routes(): void {
		this.logger.debug('Configure express.js routes ...');
		this.app.use('/auth', this.routesAuth.router);
		this.app.use('/todo', this.routesTodo.router);
	}

	public start(): void {
		this.app.listen(this.config.port, () => {
			this.logger.info(`Server listen on port ${this.config.port}`);
		});
	}
}
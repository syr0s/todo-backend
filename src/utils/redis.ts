import redis, { createClient } from 'redis';
import log4js from 'log4js';
import { IRedisConfig } from '../interface/config/redis';
import { EventLogger } from './logger';
import { config } from '../config';

export class Redis {
	private logger: log4js.Logger;
	private config: IRedisConfig = config.redis;
	public redisClient: redis.RedisClientType;

	constructor() {
		this.logger = new EventLogger(Redis.name).logger;
		this.redisClient = createClient({
			socket: {
				host: this.config.host,
				port: this.config.port,
			},
			password: this.config.password,
		});
	}

	public connect(): void {
		this.logger.info(`Try to connect to Redis as ${this.config.host}:${this.config.port}`);
		this.redisClient.connect();
		this.redisClient.on('connect', () => {
			this.logger.info('Redis connection established');
		});
		this.redisClient.on('ready', () => {
			this.logger.info('Redis key-value store ready ...');
		});
		this.redisClient.on('error', (error: Error) => {
			this.logger.error(error.message);
		});
	}
}
import log4js from 'log4js';
import { config } from '../config';

export class EventLogger {
	/**
     * Name of the class which initializes this EventLogger.
     */
	private callerName: string;

	/**
     * `log4js.Logger` object
     */
	private eventLogger: log4js.Logger;

	/**
     * `Log4js` base configuration. The `EventLogger` will log
     * all events with a log level `info` and above to a dedicated
     * logfile as well as to `stdout`.
     * The log level get overwritten on systems set to `DEBUG: true`.
     */
	private config: log4js.Configuration = {
		appenders: { 
			file: { 
				type: 'file', 
				filename: `${config.server.baseDir}/logs/api.log`
			},
			stdout: {
				type: 'stdout',
			}
		},
		categories: { 
			default: { 
				appenders: ['file', 'stdout'], 
				level: 'info' 
			} 
		}
	};

	/**
     * Returns the event logger to the caller.
     */
	public get logger() {
		return this.eventLogger;
	}

	/**
     * Creates a new `EventLogger`
     * @param callerName the name of the class, ex `System.name`.
     */
	constructor(callerName: string) {
		this.callerName = callerName;
		log4js.configure(this.config);
		this.eventLogger = log4js.getLogger(this.callerName);
		if (config.server.debug) {
			console.log(`${this.callerName} in debug mode`);
			this.eventLogger.level = 'debug';
		}
	}
}
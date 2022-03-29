/**
 * Interface of the Server configuration.
 */
export interface IServerConfig {
    /**
     * The port the server is listening on. If
     * you want the change the default port of
     * the web server, consider to change the
     * value within your `docker-compose.yml`
     * file in the `ports` section of the server.
     * Do not change the default server port, unless
     * you have good reasons to do so.
     * 
     * Default: `3000`
     */
    port: number;

    /**
     * The base directory of the RESTful API. Will
     * link to `./src` during development and can be
     * used within any file.
     */
    baseDir: string;

    /**
     * Will set the server in debug mode. This should be
     * only the case during development. Always set the
     * server to `DEBUG`: `false` in production. By setting
     * this to `true` the server will accept default configuration
     * values and provides a high verbosity on logging.
     */
    debug: boolean;
}

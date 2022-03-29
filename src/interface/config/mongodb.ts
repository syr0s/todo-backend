/**
 * Interface of the MongoDB configuration.
 */
export interface IMongodbConfig {
    /**
     * Hostname or IP address the MongoDB instance.
     * 
     * The value of this property is provided by the
     * `.env` file.
     * 
     * Default: `localhost`
     */
    host: string;

    /**
     * The port number the MongoDB instance is
     * listen on.
     * 
     * The value of this property is provided by the
     * `.env` file.
     * 
     * Default: `27017`
     */

    port: number;
    /**
     * The database to use on the MongoDB server instance.
     * 
     * The value of this property is provided by the
     * `.env` file.
     * 
     * Default: `todo-test`
     */
    database: string;

    /**
     * The username which has read/write access on the MongoDB
     * server instance / database.
     * 
     * The value of this property is provided by the
     * `.env` file.
     * 
     * Default: `mongodb-test-user`
     */
    username: string;

    /**
     * The password for the database user.
     * 
     * The value of this property is provided by the
     * `.env` file.
     * 
     * Default: `testUserPassw0rd`
     */
    password: string;
}

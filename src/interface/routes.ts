import { Router } from 'express';

export interface IRoute {
    /**
     * Router object of the routes.
     * This object is required in the
     * `express.js` Server class.
     */
    router: Router;

    /**
     * Route definitions
     */
    routes(): void;
}
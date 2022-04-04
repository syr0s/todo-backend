import { Request, Response, Router } from 'express';
import { EndpointTodoCreate } from '../endpoints/todo/create';
import { IRoute } from '../interface/routes';

export class RoutesTodo implements IRoute {
	public router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}

	routes(): void {
		this.router.all('/create', (request: Request, response: Response) => {
			new EndpointTodoCreate(request, response).method();
		});
	}
}
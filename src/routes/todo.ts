import { Request, Response, Router } from 'express';
import { EndpointTodoCreate } from '../endpoints/todo/create';
import { EndpointTodoReadAll } from '../endpoints/todo/read_all';
import { EndpointTodoReadOne } from '../endpoints/todo/read_one';
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
		this.router.all('/read_all', (request: Request, response: Response) => {
			new EndpointTodoReadAll(request, response).method();
		});
		this.router.all('/read_one', (request: Request, response: Response) => {
			new EndpointTodoReadOne(request, response).method();
		});
	}
}
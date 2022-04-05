import { Request, Response, Router } from 'express';
import { EndpointTodoAddComment } from '../endpoints/todo/add_comment';
import { EndpointTodoCreate } from '../endpoints/todo/create';
import { EndpointTodoReadAll } from '../endpoints/todo/read_all';
import { EndpointTodoReadBy } from '../endpoints/todo/read_by';
import { EndpointTodoReadOne } from '../endpoints/todo/read_one';
import { EndpointTodoUpdate } from '../endpoints/todo/update';
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
		this.router.all('/read_by', (request: Request, response: Response) => {
			new EndpointTodoReadBy(request, response).method();
		});
		this.router.all('/update', (request: Request, response: Response) => {
			new EndpointTodoUpdate(request, response).method();
		});
		this.router.all('/add_comment', (request: Request, response: Response) => {
			new EndpointTodoAddComment(request, response).method();
		});
	}
}
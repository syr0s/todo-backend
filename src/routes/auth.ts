import { Request, Response, Router } from 'express';
import { EndpointLogin } from '../endpoints/auth/login';
import { IRoute } from '../interface/routes';

export class RoutesAuth implements IRoute {
	public router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}
	public routes(): void {
		this.router.all('/login', (request: Request, response: Response) => {
			new EndpointLogin(request, response).method();
		});
	}
}
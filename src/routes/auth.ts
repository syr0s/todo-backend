import { Request, Response, Router } from 'express';
import { EndpointAuthLogin } from '../endpoints/auth/login';
import { EndpointAuthRegister } from '../endpoints/auth/register';
import { IRoute } from '../interface/routes';

export class RoutesAuth implements IRoute {
	public router: Router;

	constructor() {
		this.router = Router();
		this.routes();
	}
	public routes(): void {
		this.router.all('/login', (request: Request, response: Response) => {
			new EndpointAuthLogin(request, response).method();
		});
		this.router.all('/register', (request: Request, response: Response) => {
			new EndpointAuthRegister(request, response).method();
		});
	}
}
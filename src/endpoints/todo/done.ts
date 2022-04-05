import { Request, Response } from 'express';
import log4js from 'log4js';
import { ProtectedEndpoint } from '../../abstract/protected_endpoint';
import { TodoController } from '../../controller/todo_controller';
import { EventLogger } from '../../utils/logger';

export class EndpointTodoDone extends ProtectedEndpoint {
	protected logger: log4js.Logger;
	protected request: Request;
	protected response: Response;

	private todoController: TodoController = new TodoController();

	private paramArgs: string[] = ['id'];
	private bodyArgs: string[] = ['done'];

	constructor(request: Request, response: Response) {
		super();
		this.request = request;
		this.response = response; 
		this.logger = new EventLogger(EndpointTodoDone.name).logger;
	}

	protected post(): void {
		if (this.authorize()) {
			const param = this.sortOut(this.request.query);
			if (!this.validatePayload(param, this.paramArgs)) {
				this.status(400);
				return;
			}
			const body = this.sortOut(this.request.body);
			if (!this.validatePayload(body, this.bodyArgs)) {
				this.status(400);
				return;
			}
			this.todoController.done(String(this.jwt.uuid), String(this.request.query.id), body.done).then((status) => {
				if (!status) {
					this.status(404);
					return;
				}
				this.status(status);
				this.response.sendStatus(status);
			});
		}
	}
}
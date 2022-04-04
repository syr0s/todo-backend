import { Request, Response } from 'express';
import log4js from 'log4js';
import { ProtectedEndpoint } from '../../abstract/protected_endpoint';
import { TodoController } from '../../controller/todo_controller';
import { EventLogger } from '../../utils/logger';

export class EndpointTodoReadAll extends ProtectedEndpoint {
	protected logger: log4js.Logger;
	protected request: Request;
	protected response: Response;

	private todoController: TodoController = new TodoController();

	constructor(request: Request, response: Response) {
		super();
		this.logger = new EventLogger(EndpointTodoReadAll.name).logger;
		this.request = request;
		this.response = response;
	}

	protected get(): void {
		if (this.authorize()) {
			if (!this.validatePayload(this.request.body, [])) {
				this.status(400);
				return;
			}
			if (!this.validatePayload(this.request.query, [])) {
				this.status(400);
				return;
			}
			this.todoController.readAll(String(this.jwt.uuid)).then((result) => {
				this.status(200);
				this.response.status(200).send(result);
			});
		}

        
	}
}
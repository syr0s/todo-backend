import { Request, Response } from 'express';
import log4js from 'log4js';
import { ProtectedEndpoint } from '../../abstract/protected_endpoint';
import { TodoController } from '../../controller/todo_controller';
import { EventLogger } from '../../utils/logger';

export class EndpointTodoReadOne extends ProtectedEndpoint {
	protected logger: log4js.Logger;
	protected request: Request;
	protected response: Response;

	private paramArgs: string[] = ['id'];
	private todoController: TodoController = new TodoController();

	constructor(request: Request, response: Response) {
		super();
		this.request = request;
		this.response = response;
		this.logger = new EventLogger(EndpointTodoReadOne.name).logger;
	}

	protected get(): void {
		if (this.authorize()) {
			if (!this.validatePayload(this.request.body, [])) {
				this.status(400);
				return;
			}

			if (!this.validatePayload(this.request.query, this.paramArgs)) {
				this.status(400);
				return;
			}
			this.todoController.readOne(String(this.jwt.uuid), String(this.request.query.id)).then((result) => {
				if (result) {
					this.status(200);
					this.response.status(200).send(result);
					return;
				}
				this.status(404);
				return;
			});
		}
	}
}
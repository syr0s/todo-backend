import { Request, Response } from 'express';
import log4js from 'log4js';
import { ProtectedEndpoint } from '../../abstract/protected_endpoint';
import { TodoController } from '../../controller/todo_controller';
import { EventLogger } from '../../utils/logger';

export class EndpointTodoReadBy extends ProtectedEndpoint {
	protected logger: log4js.Logger;
	protected request: Request;
	protected response: Response;

	private todoController: TodoController = new TodoController();

	private paramArgs: string[] = [
		'tag', 'list', 'assigned', 'priority'
	];

	constructor(request: Request, response: Response) {
		super();
		this.request = request;
		this.response = response;
		this.logger = new EventLogger(EndpointTodoReadBy.name).logger;
	}

	protected get(): void {
		if (this.authorize()) {
			if (!this.validatePayload(this.request.body, [])) {
				this.status(400);
				return;
			}

			if (!this.validatePayload(this.request.query, this.paramArgs, false)) {
				this.status(400);
				return;
			}
			
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const query:any = this.sortOut(this.request.query);

			// Check again, as the query object could be empty now
			if (!this.validatePayload(query, this.paramArgs, false)) {
				this.status(400);
				return;
			}

			this.todoController.readyBy(String(this.jwt.uuid), query).then((result) => {
				this.status(200);
				this.response.status(200).send(result);
				return;
			});
		}
	}
}
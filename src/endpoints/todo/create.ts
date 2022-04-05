import log4js from 'log4js';
import { Request, Response } from 'express';
import { EventLogger } from '../../utils/logger';
import { ITodo } from '../../interface/todo';
import { ProtectedEndpoint } from '../../abstract/protected_endpoint';
import { TodoController } from '../../controller/todo_controller';

export class EndpointTodoCreate extends ProtectedEndpoint {
	protected request: Request;
	protected response: Response;
	protected logger: log4js.Logger;
    
	private bodyArgs: string[] = [
		'title', 'description', 'priority', 'tag', 'list', 'timestampDue',
		'timestampNotification', 'assigned',
	];

	private todoController: TodoController = new TodoController();

	constructor(request: Request, response: Response) {
		super();
		this.request = request;
		this.response = response;
		this.logger = new EventLogger(EndpointTodoCreate.name).logger;
	}

	protected put(): void {
		if (this.authorize()) {
			if (!this.validatePayload(this.request.query, [])) {
				this.status(400);
				return;
			}
            
			if (!this.validatePayload(this.request.body, this.bodyArgs, false)) {
				this.status(400);
				return; 
			}
    
			if (this.request.body.title == undefined || this.request.body.title.length == 0) {
				this.status(400);
				return;
			}

			const data: ITodo = {
				title: this.request.body.title,
				description: this.request.body.description,
				priority: this.request.body.priority || 1,
				done: false,
				tag: this.request.body.tag,
				list: this.request.body.list,
				timestampDue: this.request.body.timestampDue,
				timestampNotification: this.request.body.timestampNotification,
				assigned: this.request.body.assigned || this.jwt.uuid,
				metadata: {
					created: {
						timestamp: Date.now(),
						createdBy: this.jwt.uuid,
					}
				},
			} as ITodo;
			this.todoController.create(String(this.jwt.uuid), data).then((status) => {
				this.status(status);
				this.response.sendStatus(status);
			}).catch((error: Error )=> {
				this.logger.error(error.message);
				this.status(500);
			});
		}

		
	}
}
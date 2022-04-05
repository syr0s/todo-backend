/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import log4js from 'log4js';
import { ProtectedEndpoint } from '../../abstract/protected_endpoint';
import { TodoController } from '../../controller/todo_controller';
import { ITodo } from '../../interface/todo';
import { EventLogger } from '../../utils/logger';

export class EndpointTodoUpdate extends ProtectedEndpoint {
	protected logger: log4js.Logger;
	protected request: Request;
	protected response: Response;

	private todoController: TodoController = new TodoController();

	private paramArgs: string[] = ['id'];
	private bodyArgs: string[] = [
		'title', 'description', 'priority', 'done', 'tag', 
		'list', 'timestampDue', 'timestampNotification'
	];

	constructor(request: Request, response: Response) {
		super();
		this.request = request;
		this.response = response;
		this.logger = new EventLogger(EndpointTodoUpdate.name).logger;
	}

	protected post(): void {
		if (this.authorize()) {
			const param: any = this.sortOut(this.request.query);
			if (!this.validatePayload(param, this.paramArgs)) {
				this.status(400);
				return;
			}

			const body: ITodo = this.sortOut(this.request.body) as ITodo;
			if (!this.validatePayload(body, this.bodyArgs, false)) {
				this.status(400);
				return;
			}
			
			this.todoController.update(String(this.jwt.uuid), String(this.request.query.id), body).then((status) => {
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
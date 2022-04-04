import log4js from 'log4js';
import { ITodo } from '../interface/todo';
import { TodoModel } from '../models/todos';
import { EventLogger } from '../utils/logger';
export class TodoController {
	protected logger: log4js.Logger;

	constructor() {
		this.logger = new EventLogger(TodoController.name).logger;  
	}

	public async create(uuid: string, data: ITodo): Promise<number> {
		await new new TodoModel(uuid)
			.model(data)
			.save()
			.catch((error: Error) => {
				this.logger.error(error.message);
			});
		return 201;
	}

	public async readAll(uuid: string): Promise<object[]> {
		return await new TodoModel(uuid)
			.model
			.find()
			.lean()
			.exec();
	}

	public async readOne(uuid: string, id: string): Promise<object | null> {
		return await new TodoModel(uuid)
			.model
			.findById(id)
			.lean()
			.exec().catch((error: Error) => {
				this.logger.error(error.message);
				return null;
			});
	}

}
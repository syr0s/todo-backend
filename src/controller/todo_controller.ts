import log4js from 'log4js';
import { ITodo } from '../interface/todo';
import { TodoModel } from '../models/todos';
import { EventLogger } from '../utils/logger';
import { UserAuthController } from './user_auth';
export class TodoController {
	protected logger: log4js.Logger;

	constructor() {
		this.logger = new EventLogger(TodoController.name).logger;  
	}

	public async addComment(uuid: string, id: string, comment: string): Promise<number> {
		await new TodoModel(uuid)
			.model
			.findByIdAndUpdate(id, {
				$push: {
					comments: {
						timestamp: Date.now(),
						createdBy: uuid,
						content: comment,
					}
				}
			}).catch((error: Error) => {
				this.logger.error(error.message);
				return 500;
			}).then((result) => {
				if (result) {
					this.setUpdate(id, uuid);
					return 201;
				} else {
					this.logger.error(`Could not add comment to todo ${id}`);
					return 500;
				}
			});
		return 201;
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

	public async done(uuid: string, id: string, val: boolean): Promise<number | null> {
		return await new TodoModel(uuid)
			.model
			.findByIdAndUpdate(id, {
				done: val
			})
			.lean()
			.exec()
			.catch((error: Error) => {
				this.logger.error(error.message);
				return null;
			}).
			then((result) => {
				if (result) {
					this.setUpdate(id, uuid);
					new UserAuthController().updateCompleteCounter(uuid, val);
					return 200;
				} else {
					this.logger.error(`todo id ${id} not found`);
					return null;
				}
			});
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

	public async readyBy(uuid: string, query: object): Promise<object | object[] | null> {
		return await new TodoModel(uuid)
			.model
			.find(query)
			.lean()
			.exec().catch((error: Error) => {
				this.logger.error(error.message);
				return null;
			});
	}

	public async update(uuid: string, id: string, data: ITodo): Promise<number | null> {
		return await new TodoModel(uuid)
			.model
			.findByIdAndUpdate(id, data)
			.lean()
			.exec().catch((error: Error) => {
				this.logger.error(error.message);
				return null;
			}).then((result) => {
				if (result) {
					this.setUpdate(id, uuid);
					return 200;
				}
				this.logger.error(`todo id ${id} did not exists!`);
				return null;
			});
		
	}

	private async setUpdate(id: string, uuid: string): Promise<void> {
		await new TodoModel(uuid)
			.model
			.findByIdAndUpdate(id, {
				$push: {
					'metadata.updates': {
						timestamp: Date.now(),
						updateBy: uuid,
					}
				}
			})
			.exec().catch((error: Error) => {
				this.logger.error(error.message);
			});
	}

}
import { Schema, Model, model, models } from 'mongoose';
import { IModel } from '../interface/model';
import { ITodo  } from '../interface/todo';

// FIXME as the class is already created, it will not overwrite the collection!
export class TodoModel implements IModel {
	public key: string;
	public schema: Schema;
	private prefix = 'todos_';
	protected collection: string;

	constructor(collection: string) {
		this.collection = collection;
		this.key = 'K_' + collection;
		this.schema = new Schema({
			title: String,
			description: String,
			priority: Number,
			done: Boolean,
			tag: String,
			list: String,
			timestampDue: Number,
			timestampNotification: Number,
			assigned: String,
			metadata: {
				created: {
					timestamp: Number,
					createdBy: String,
				},
				updates: [
					{
						timestamp: Number,
						updateBy: String,
					},
				],
			},
			comments: [
				{
					timestamp: Number,
					createdBy: String,
					content: String,
				},
			],
		}, {
			collection: this.prefix + this.collection,
		});
	}

	get model(): Model<ITodo> {
		if (models && models[this.key]) return models[this.key];
		return model<ITodo>(this.key, this.schema);
	}

}
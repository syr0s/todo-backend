import { Schema, Model, model, models } from 'mongoose';
import { IModel } from '../interface/model';
import { IUser } from '../interface/user';
export class UserModel implements IModel {
	public key: string;
	public schema: Schema;

	constructor() {
		this.key = 'Users';
		this.schema = new Schema({
			email: String,
			passwordHash: String,
			timestampCreated: Number,
			active: Boolean,
			confirmationLink: String,
			timestampConfirm: Number,
		}, {
			collection: 'users',
		});
	}

	get model(): Model<IUser> {
		if (models && models[this.key]) return models[this.key];
		return model<IUser>(this.key, this.schema);
	}
}
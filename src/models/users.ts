import { Schema, Model, model } from 'mongoose';
import { IUser } from '../interface/user';
export const userSchema = new Schema({
	email: String,
	passwordHash: String,
	timestampCreated: Number,
	active: Boolean,
	confirmationLink: String,
	timestampConfirm: Number,
});

export const ModelUsers: Model<IUser> = model<IUser>('users', userSchema);
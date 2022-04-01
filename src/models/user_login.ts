import { Schema, Model, model } from 'mongoose';
import { IUser } from '../interface/user';
export const userLoginSchema = new Schema({
	email: String,
	passwordHash: String,
	active: Boolean,
});

export const UserLogin: Model<IUser> = model<IUser>('users', userLoginSchema);
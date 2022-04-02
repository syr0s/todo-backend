import { LeanDocument } from 'mongoose';
import { IUser } from '../interface/user';
import { ModelUsers } from '../models/users';

export class UserAuthController {
	public async login(email: string): Promise<LeanDocument<IUser & { _id: string; }> | null> {
		return await ModelUsers
			.findOne({
				email: email,
			})
			.lean()
			.exec();
	}

	public async register(user: IUser): Promise<number> {
		const result = await ModelUsers
			.findOne({
				email: user.email
			});
		if (!result) {
			const userRegister = new ModelUsers(user);
			await userRegister.save().catch((error: Error) => {
				console.log(error.message);
			});
			return 201;
		}
		return 409;
	}

	
	public async confirm(confirmationLink: string): Promise<number> {
		const result = await ModelUsers.findOneAndUpdate({
			confirmationLink: confirmationLink,
		}, {
			active: true,
			timestampConfirm: Date.now(),
		});
		console.log(result);
		if (result) {
			// Delete the confirmation link to avoid multiple useage on it
			await ModelUsers.findOneAndUpdate({
				confirmationLink: confirmationLink,
			}, {
				$unset: {confirmationLink}
			});
			return 200;
		} else {
			return 404;
		}
	}
}
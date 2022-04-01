import { IUser } from '../interface/user';
import { ModelUsers } from '../models/users';

export class UserAuthController {
	public async login(email: string): Promise<any> {
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
}
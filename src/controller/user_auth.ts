import { UserLogin } from '../models/user_login';

export class UserAuthController {
	public async login(email: string): Promise<any> {
		return await UserLogin
			.findOne({
				email: email,
			})
			.lean()
			.exec();
	}
}
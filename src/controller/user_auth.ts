import { LeanDocument } from 'mongoose';
import { IUser } from '../interface/user';
import { ModelUsers } from '../models/users';
import { Redis } from '../utils/redis';

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
			const client = new Redis().redisClient;
			client.connect();
			client.hSet(
				String(user.confirmationLink), 
				['email', user.email, 'passwordHash', user.passwordHash, 'timestampCreated', user.timestampCreated],
			);
			// created link will expire after one day
			client.expire(String(user.confirmationLink), 60 * 60 * 24);
			console.log(await client.hGetAll(String(user.confirmationLink)));
			return 201;
		}
		return 409;
	}

	
	public async confirm(confirmationLink: string): Promise<number> {
		const client = new Redis().redisClient;
		client.connect();
		const result = await client.hGetAll(confirmationLink);
		if (result) {
			const user: IUser = {
				email: result.email,
				passwordHash: result.passwordHash,
				timestampCreated: Number(result.timestampCreated),
				active: true,
				timestampConfirm: Date.now(),
			} as IUser;
			const userRegister = new ModelUsers(user);
			await userRegister.save().catch((error: Error) => {
				console.log(error.message);
			});
			client.del(confirmationLink);
			return 200;
		} else {
			return 404;
		}
	}
}
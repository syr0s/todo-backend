import { LeanDocument } from 'mongoose';
import { IUser } from '../interface/user';
import { UserModel } from '../models/users';
import { Redis } from '../utils/redis';
import log4js from 'log4js';
import { EventLogger } from '../utils/logger';
import { toBoolean } from '../utils/helper';

export class UserAuthController {
	protected logger: log4js.Logger;

	constructor() {
		this.logger = new EventLogger(UserAuthController.name).logger;
	}
	public async login(email: string): Promise<LeanDocument<IUser & { _id: string; }> | null> {
		return await new UserModel().model
			.findOne({
				email: email,
			})
			.lean()
			.exec();
	}

	public async register(user: IUser): Promise<number> {
		const result = await new UserModel().model
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
			client.expire(String(user.confirmationLink), 60 * 60 * 24);
			return 201;
		}
		return 409;
	}

	
	public async confirm(confirmationLink: string): Promise<number> {
		const client = new Redis().redisClient;
		client.connect();
		const exists = await client.exists(confirmationLink);
		const result = await client.hGetAll(confirmationLink);
		if (exists) {
			const user: IUser = {
				email: result.email,
				passwordHash: result.passwordHash,
				timestampCreated: Number(result.timestampCreated),
				active: true,
				timestampConfirm: Date.now(),
			} as IUser;
			// It could be possible that redis has stored multiple confirmation links
			// for a single user (clicking to often on the create button, for example)
			// This could cause, that the user will receive multiple e-mails with
			// multiple links. We have to check if the user not exists in the 
			// database before we generate it
			const res = await new UserModel().model.findOne({email: user.email}).lean().exec();
			if (!res) {
				const userRegister = new new UserModel().model(user);
				await userRegister.save().catch((error: Error) => {
					this.logger.error(error.message);
				});
				client.del(confirmationLink);
				return 200;
			} else {
				// Delete the invalid link in redis
				client.del(confirmationLink);
				return 409;
			}
		} else {
			return 404;
		}
	}

	public async updateCompleteCounter(uuid: string, val: boolean): Promise<void> {
		let int = 1;
		if (!toBoolean(String(val))) {
			int = -1;
		}
		await new UserModel()
			.model
			.findByIdAndUpdate(uuid, {
				$inc: {
					completed: int
				}
			})
			.exec()
			.catch((error: Error) => {
				this.logger.error(error.message);
			});
	}
}
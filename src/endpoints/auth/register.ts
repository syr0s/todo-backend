import { Request, Response } from 'express';
import log4js from 'log4js';
import { Endpoint } from '../../abstract/endpoint';
import { UserAuthController } from '../../controller/user_auth';
import { IUser } from '../../interface/user';
import { randomString } from '../../utils/helper';
import { EventLogger } from '../../utils/logger';

export class EndpointAuthRegister extends Endpoint {
	protected request: Request;
	protected response: Response;
	protected logger: log4js.Logger;
	private userAuthController: UserAuthController;
	private bodyArgs: string[] = ['email', 'passwordHash'];

	constructor(request: Request, response: Response) {
		super();
		this.request = request;
		this.response = response;
		this.logger = new EventLogger(EndpointAuthRegister.name).logger;
		this.userAuthController = new UserAuthController();
	}

	protected put(): void {

		if (!this.validatePayload(this.request.query, [])) {
			this.status(400);
			return;
		}

		if (!this.validatePayload(this.request.body, this.bodyArgs)) {
			this.status(400);
			return;
		}
		const user: IUser = {
			email: this.request.body.email,
			passwordHash: this.request.body.passwordHash,
			timestampCreated: Date.now(),
			completed: 0,
			active: false,
			confirmationLink: randomString(128),
		} as IUser;
		this.userAuthController.register(user).then((status) => {
			this.status(status);
			if (status === 201) {
				// TODO #1 send confirmation email
				this.logger.info(`Created unconfirmed user on link id: ${user.confirmationLink}`);
				this.response.sendStatus(status);
			}
		}).catch((error: Error) => {
			this.logger.error(error.message);
			this.status(500);
		});
	}
}
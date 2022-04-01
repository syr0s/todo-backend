import { Request, Response } from 'express';
import { Logger } from 'log4js';
import { Endpoint } from '../../abstract/endpoint';
import { UserAuthController } from '../../controller/user_auth';
import { Jwt } from '../../utils/jwt';
import { EventLogger } from '../../utils/logger';

export class EndpointLogin extends Endpoint {
	protected request: Request;
	protected response: Response;
	protected logger: Logger;
	private userAuthController: UserAuthController;
	private jwt: Jwt;
	private bodyArgs: string[] = ['email', 'passwordHash'];

	constructor(request: Request, response: Response) {
		super();
		this.request = request;
		this.response = response;
		this.userAuthController = new UserAuthController();
		this.jwt = new Jwt();
		this.logger = new EventLogger(EndpointLogin.name).logger;
	}

	protected get(): void {
		if (!this.validatePayload(this.request.body, this.bodyArgs)) {
			this.status(400);
		}
		this.userAuthController.login(this.request.body.email).then((result) => {
			if (result) {
				this.logger.debug(`Found user ${this.request.body.email} in the database (UUID: ${result._id})`);
				if (result.passwordHash === this.request.body.passwordHash) {
					const payload = {
						token: this.jwt.create(result._id),
						uuid: result._id
					};
					this.status(200);
					this.response.status(200).send(payload);
				} else {
					this.status(403);
				}
			} else {
				this.logger.warn('Requested user to login not part of the database');
				this.status(401);
			}
		});
	}
}
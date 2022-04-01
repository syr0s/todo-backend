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

	/**
     * `GET` method for endpoint `/auth/login`.
     * 
     * For further information, consult the [documentation](../../../api-docs/docs/endpoints/auth/login.md)
     */
	protected get(): void {

		if (!this.validatePayload(this.request.query, [])) {
			this.status(400);
			return;
		}
		
		if (this.jwt.getToken(this.request.headers.authorization)) {
			if (this.jwt.validate(String(this.jwt.token))) {
				this.logger.debug('Login requested with token provided');
				this.status(200);
				this.response.status(200).send(this.createPayload(String(this.jwt.uuid)));
				return;
			}
		}

		if (!this.validatePayload(this.request.body, this.bodyArgs)) {
			this.status(400);
			return;
		}

		this.userAuthController.login(this.request.body.email).then((result) => {
			if (result) {
				this.logger.debug(`Found user ${this.request.body.email} in the database (UUID: ${result._id})`);
				if (result.passwordHash === this.request.body.passwordHash) {
					if (result.active) {
						this.status(200);
						this.response.status(200).send(this.createPayload(result._id));
						return;
					} else {
						this.status(423);
					}
					
				} else {
					this.status(403);
					return;
				}
			} else {
				this.logger.warn('Requested user not found in the database');
				this.status(401);
			}
		});
	}

	/**
     * Creates the response payload, aka the json web token.
     * @param uuid 
     * @returns 
     */
	private createPayload(uuid: string): object {
		return {
			token: this.jwt.create(uuid),
			uuid: uuid,
		};
	}
}
import { Request, Response } from 'express';
import log4js from 'log4js';
import { Endpoint } from '../../abstract/endpoint';
import { UserAuthController } from '../../controller/user_auth';
import { EventLogger } from '../../utils/logger';

export class EndpointAuthConfirm extends Endpoint {
	protected logger: log4js.Logger;
	protected request: Request;
	protected response: Response;
	protected userAuthController: UserAuthController = new UserAuthController();

	private paramArgs: string[] = ['id'];

	constructor(request: Request, response: Response) {
		super();
		this.request = request;
		this.response = response;
		this.logger = new EventLogger(EndpointAuthConfirm.name).logger;
	} 

	protected get(): void {

		if(!this.validatePayload(this.request.body, [])) {
			this.status(400);
			return;
		}

		if (!this.validatePayload(this.request.query, this.paramArgs)) {
			this.status(400);
			return;
		}

		this.userAuthController.confirm(String(this.request.query.id)).then((status) => {
			this.status(status);
			if (status === 200) this.response.sendStatus(status);
		});
	}
} 
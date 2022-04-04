import { Jwt } from '../utils/jwt';
import { Endpoint } from './endpoint';

export abstract class ProtectedEndpoint extends Endpoint {
	protected jwt: Jwt;

	constructor() {
		super();
		this.jwt = new Jwt();
	}

	protected authorize(): boolean | void {
		if (!this.jwt.getToken(this.request.headers.authorization)) {
			this.status(401);
			return;
		}

		if (this.jwt.validate(String(this.jwt.token))) {
			return true;
		}
		this.status(401);
		return;
	}
}
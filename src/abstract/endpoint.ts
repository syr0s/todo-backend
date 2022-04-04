/* eslint-disable no-mixed-spaces-and-tabs */
import { Request, Response } from 'express';
import log4js from 'log4js';

export abstract class Endpoint {
    protected abstract request: Request;
    protected abstract response: Response;
    protected abstract logger: log4js.Logger;

    public method(): void {
    	switch(this.request.method) {
    	case 'DELETE': {
    		this.del();
    		break;
    	}
    	case 'GET': {
    		this.get();
    		break;
    	}
    	case 'POST': {
    		this.post();
    		break;
    	}
    	case 'PUT': {
    		this.put();
    		break;
    	}
    	default: {
    		this.notImplemented();
    		break;
    	}
    	}
    }

    protected del(): void {
    	this.notImplemented();
    }

    protected get(): void {
    	this.notImplemented();
    }

    protected post(): void {
    	this.notImplemented();
    }

    protected put(): void {
    	this.notImplemented();
    }

    /**
     * Status logger of an incoming request. Will respond to the client, if
     * the passed in http status code is higher then `399`.
     * @param status http status code as `number`
     */
    protected status(status: number): void {
    	const responseMessage = `${this.request.method} request on endpoint ${this.request.baseUrl}${this.request.path} (Response code: ${status})`;
    	if (status > 399) {
    		this.logger.warn(responseMessage);
    		this.response.sendStatus(status);
    	} else {
    		this.logger.info(responseMessage);
    	}
    }

    /**
     * Validates the given payload contains exactly the required keys.
	 * Using strict mode requires, that the payload has the exact length of the
	 * given keys. While `strict = false` will require only that the provided
	 * payload is not greater then the keys.
     * @param payload 
     * @param keys 
     * @returns 
     */
    protected validatePayload(payload: object, keys: string[], strict = true): boolean {
    	const validateArray: boolean[] = [];
    	for (const key in payload) {
    		if (keys.includes(key)) {
    			validateArray.push(true);
    		} else {
    			this.logger.debug(`Invalid key ${key} in payload`);
    			validateArray.push(false);
    		}
    	}
    	if (strict) {
    		if (validateArray.includes(false) || validateArray.length != keys.length) {
    			this.logger.debug(`Payload invalid! Length should: ${keys.length} got: ${validateArray.length}. Invalid keys detected: ${validateArray.includes(false)}`);
    			return false;
    		}
    	} else {
    		if (validateArray.includes(false) || validateArray.length > keys.length) {
    			this.logger.debug(`Payload invalid! Length should: ${keys.length} got: ${validateArray.length}. Invalid keys detected: ${validateArray.includes(false)}`);
    			return false;
    		}
    	}
    	
    	return true;
    }

    /**
     * Gets called everytime a client requests an unsupported method
     * on an endpoint. Will log the event.
     * 
     * Response with http status code `405 - Method Not Allowed`
     */
    private notImplemented(): void {
    	this.logger.error(`Method ${this.request.method} not implemented for endpoint ${this.request.baseUrl}${this.request.path}`);
    	this.response.sendStatus(405);
    }
}
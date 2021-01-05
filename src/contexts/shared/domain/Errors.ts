import { Request, Response, NextFunction } from 'express';
import { Logger } from '../infraestructure/Logger';
import { pick, omit } from 'lodash'


export type ErrorExtension = {
	code: any;
	exception: any;
}

/**
 * General error handle class
 */
export class GeneralError extends Error {
	public message: string;
	public extensions: ErrorExtension;

	/**
	 * Constructor
	 * @param message The message message to console
	 * @param code The code of the error
	 */
	constructor(message?: string, code?:number, exception?: any) {
		super();
		this.message = message || '';
		this.extensions = {
			code: code || 0,
			exception: exception || null
		}
	}
	public getCode(): number {
		if (this instanceof BadRequest) return this.extensions.code || 400;
		if (this instanceof Unauthorized) return this.extensions.code || 401;
		if (this instanceof PaymentRequired) return this.extensions.code || 402;
		if (this instanceof Forbidden) return this.extensions.code || 403;
		if (this instanceof NotFound) return this.extensions.code || 404;
		return 500;
	}
	public getMessage(): string {
		if (this instanceof InvalidID) return this.message || 'The given ID have the incorrect format';
		if (this instanceof InvalidArgument) return this.message || 'Argument with bad format or doesn`t exists';
		if (this instanceof BadRequest) return this.message || 'Bad Request';
		if (this instanceof Unauthorized) return this.message || 'Credentials are invalids';
		if (this instanceof PaymentRequired) return this.message || 'Payment required to this route';
		if (this instanceof Forbidden) return this.message || 'You are not allowed to use this route';
		if (this instanceof RouteNotFound) return this.message || 'The requested route doesn`t exists';
		if (this instanceof ElementNotFound) return this.message || 'The entity requested doesn`t exists';
		if (this instanceof NotFound) return this.message || 'Not Found';
		return 'Internal Server Error';
	}
}

/**
 * Middleware to handle the global scope error
 * @param err Error object
 * @param req Request express object
 * @param res Response object
 * @param next Next function
 */
export function expressErrorHandler(err: any, req: Request, res: Response, next: NextFunction): Response {
	if (err instanceof GeneralError) {
		if (err.message) req.logger.log(err.getMessage(), { type: 'error', color: 'error' });
		return res.status(err.getCode()).json({
			message: err.getMessage(),
		});
	}
	req.logger.log(err.message, { type: 'error', color: 'error' });
	return res.status(500).json({
		message: 'Internal Server Error',
	});
}

export function graphQLErrorHandler(logger: Logger) {
	return (error:any) => {
		error = error.originalError;
		if (error instanceof GeneralError) {
			console.log(error)
			if (error.message) logger.log(`${error.getCode()} ${error.getMessage()} ${error.extensions.exception}`, { type: 'error', color: 'error' });
			error = omit(error, 'extensions.exception')
			return error
		}
		logger.log(`500 ${error.message} ${error.extensions.exception}`, { type: 'error', color: 'error' });
		return omit(new GeneralError('Internal Server Error', 500), 'extensions.exception');
	}
}

/**
 * Class to code 400 Invalid ID or BadRequest general
 */
export class BadRequest extends GeneralError {}

/**
 * Class to code 401 to Unauthorized request, Credentials are invalid
 */
export class Unauthorized extends GeneralError {}

/**
 * Class to code 402 Payment Required to this request
 */
export class PaymentRequired extends GeneralError {}

/**
 * Class to code 403, Your not allowed to use this route
 */
export class Forbidden extends GeneralError {}

/**
 * Class to code 404, Route or Element not found
 */
export class NotFound extends GeneralError {}

//------------------//

/**
 * Invalid ID of entity
 */
export class InvalidID extends BadRequest {}

/**
 *
 */
export class InvalidArgument extends BadRequest {}

/**
 * The requested route doesn`t exits
 */
export class RouteNotFound extends NotFound {}

/**
 * The entity requested doesn`t exits
 */
export class ElementNotFound extends NotFound {}

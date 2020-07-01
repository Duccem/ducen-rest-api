import { Request, Response, NextFunction } from "express";

/**
 * General error handle class
 */
export class GeneralError extends Error {
	public log: string;

	/**
	 * Constructor
	 * @param log The message log to console
	 */
	constructor(log?: string) {
		super();
		this.log = log || "";
	}
	public getCode(): number {
		if (this instanceof BadRequest) return 400;
		if (this instanceof Unauthorized) return 401;
		if (this instanceof PaymentRequired) return 402;
		if (this instanceof Forbidden) return 403;
		if (this instanceof NotFound) return 404;
		return 500;
	}
	public getMessage(): string {
		if (this instanceof InvalidID) return this.log || "The given ID have the incorrect format";
		if (this instanceof BadRequest) return this.log || "Bad Request";
		if (this instanceof Unauthorized) return this.log || "Credentials are invalids";
		if (this instanceof PaymentRequired) return this.log || "Payment required to this route";
		if (this instanceof Forbidden) return this.log || "You are not allowed to use this route";
		if (this instanceof RouteNotFound) return this.log || "The requested route doesn`t exists";
		if (this instanceof ElementNotFound) return this.log || "The entity requested doesn`t exists";
		if (this instanceof NotFound) return this.log || "Not Found";
		return "Internal Server Error";
	}
}

/**
 * Middleware to handle the global scope error
 * @param err Error object
 * @param req Request express object
 * @param res Response object
 * @param next Next function
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): Response {
	if (err instanceof GeneralError) {
		if (err.log) req.logger.log(err.log, { type: "error", color: "error" });
		return res.status(err.getCode()).json({
			message: err.getMessage(),
		});
	}
	req.logger.log(err.message, { type: "error", color: "error" });
	return res.status(500).json({
		message: "Internal Server Error",
	});
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
 * The requested route doesn`t exits
 */
export class RouteNotFound extends NotFound {}

/**
 * The entity requested doesn`t exits
 */
export class ElementNotFound extends NotFound {}

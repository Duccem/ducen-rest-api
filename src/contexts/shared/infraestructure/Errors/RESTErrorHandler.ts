import { RequestTokenized } from '../../../shared/domain/Auth/IResquest'
import { NextFunction, Response } from 'express'
import { ErrorHandler } from '../../domain/Errors/ErrorHandler'
import { GeneralError } from '../../domain/Errors/Errors';
import Container from 'typedi';
import { Logger } from '../Logger';


/**
 * REST Error handler, catch all errors ocurred in the execution of a request
 * @param err The Error
 * @param req The Request object
 * @param res The Response Object
 * @param next The next function on the stack
 */
export const RESTErrorHandler:  ErrorHandler = function (err: any, req: RequestTokenized, res: Response, next: NextFunction): Response{
    const logger = Container.get<Logger>("Logger");
    if (err instanceof GeneralError) {
		if (err.message) logger.log(err.getMessage(), { type: 'error', color: 'error' });
		return res.status(err.getCode()).json({
			message: err.getMessage(),
		});
	}
	logger.log(err.message, { type: 'error', color: 'error' });
	return res.status(500).json({
		message: 'Internal Server Error',
	});
}
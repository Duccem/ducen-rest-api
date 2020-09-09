import { NextFunction, Request, Response } from 'express';
import { Unauthorized } from '../../../../contexts/shared/domain/Errors';
import jwt from 'jsonwebtoken';

export const varify = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		let head: string = req.headers['x-access-control'] as string;
		if (!head) throw new Unauthorized();
		const token = head;
		const { id }: any = jwt.verify(token, process.env.TOKEN_KEY || '2423503');
		req.userId = id;
		next();
	} catch (error) {
		if ((error.message = 'jwt expired')) {
			next(new Unauthorized());
		} else {
			next(error);
		}
	}
};

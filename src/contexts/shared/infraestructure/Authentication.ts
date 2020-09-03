import { Request, Response, NextFunction } from "express";
import { Unauthorized, GeneralError } from "contexts/shared/domain/Errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Class that work as interface of comunication with the authentication microservice
 */
export class Authentication {
	public static async passwordEncript(password: string): Promise<string> {
		try {
			let salt = await bcrypt.genSalt(10);
			let hash = await bcrypt.hash(password, salt);
			return hash;
		} catch (error) {
			throw new GeneralError(`Al encriptar contraseña, Error: ${error}`);
		}
	}

	public static async passwordCompare(password: string, hash: string): Promise<boolean> {
		try {
			let valido = await bcrypt.compare(password, hash);
			console.log(valido);
			return valido;
		} catch (error) {
			throw new GeneralError(`Al validar contraseña, Error: ${error}`);
		}
	}
}

export default function validar(options?: any) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			let head: string = req.headers["x-access-control"] as string;
			if (!head) throw new Unauthorized();
			const token = head;
			const { id }: any = jwt.verify(token, process.env.TOKEN_KEY || "2423503");
			req.userId = id;
			next();
		} catch (error) {
			if ((error.message = "jwt expired")) {
				next(new Unauthorized());
			} else {
				next(error);
			}
		}
	};
}

import jwt from 'jsonwebtoken';
import { AuthJsonDocument } from '../domain/Types/AuthJsonDocument';
import { UserJsonDocument } from '../domain/Types/UserJsonDocument';
import { Auth } from '../domain/Auth';

export type AuthPayload = {
	id: string;
};

export class JWTAuth implements Auth {
	private secretKey: string;
	constructor(secret: string) {
		this.secretKey = secret;
	}
	public formatResponse(user: UserJsonDocument): UserJsonDocument {
		let token = jwt.sign({ id: user._id }, this.secretKey, { expiresIn: 60 * 60 * 24 });
		user.token = token;
		return user;
	}

	public verifyToken(token: string): AuthPayload {
		let { id }: any = jwt.verify(token, this.secretKey);
		return {
			id,
		};
	}
}

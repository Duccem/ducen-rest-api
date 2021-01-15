import jwt from 'jsonwebtoken';
import { UserJsonDocument } from '../domain/Types/UserJsonDocument';
import { Auth } from '../domain/Interfaces/Auth';
import { set } from 'lodash';

export type AuthPayload = {
	id: string;
};

export class JWTAuth implements Auth {
	private secretKey: string;
	constructor(secret: string) {
		this.secretKey = secret;
	}
	public formatResponse(user: UserJsonDocument): UserJsonDocument {
		const userCodifiedToken = <UserJsonDocument>{}
		set(userCodifiedToken, 'profiles', user.profiles);
		set(userCodifiedToken, '_id', user._id);
		set(userCodifiedToken, 'administrativeData', user.administrativeData);
		let token = jwt.sign(userCodifiedToken, this.secretKey, { expiresIn: 60 * 60 * 24 });
		user.token = token;
		return user;
	}

	public verifyToken(token: string): AuthPayload {
		let userCodifiedToken: any = jwt.verify(token, this.secretKey);
		return userCodifiedToken;
	}
}

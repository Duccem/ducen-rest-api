import { AuthJsonDocument } from './Types/AuthJsonDocument';
import { UserJsonDocument } from './Types/UserJsonDocument';

export interface Auth {
	formatResponse(user: UserJsonDocument): AuthJsonDocument;
	verifyToken(token: string): any;
}

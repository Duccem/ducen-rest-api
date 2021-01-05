import { User } from 'apps/GraphApi/schema/types/user.type';
import { AuthJsonDocument } from './Types/AuthJsonDocument';
import { UserJsonDocument } from './Types/UserJsonDocument';

export interface Auth {
	formatResponse(user: UserJsonDocument): UserJsonDocument;
	verifyToken(token: string): any;
}

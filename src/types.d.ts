import { Logger } from "./app/libs/Logger";

declare global {
	namespace Express {
		export interface Request {
			userId: string;
			tenantId: string;
			file: Multer.File;
			logger: Logger;
		}
	}
}

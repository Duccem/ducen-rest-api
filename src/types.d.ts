import { Logger } from "ducenlogger";

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

import { Logger } from "ducenlogger";

declare global {
	namespace Express {
		export interface Request {
			userId: string;
			file: Multer.File;
			logger: Logger;
		}
	}
}

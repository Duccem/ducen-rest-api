import { GeneralError } from "../../domain/Errors/Errors";
import { omit } from "lodash";
import Container from "typedi";
import { Logger } from "../Logger";

export const GraphErrorHandler = function (error: any): any {
    const logger = Container.get<Logger>("Logger");
    error = error.originalError;
    if (error instanceof GeneralError) {
        if (error.message) logger.log(`${error.getCode()} ${error.getMessage()}`, { type: 'error', color: 'error' });
        error = omit(error, 'extensions.exception')
        return error
    }
    logger.log(`500 ${error.message} ${error.extensions.exception}`, { type: 'error', color: 'error' });
    return omit(new GeneralError('Internal Server Error', 500), 'extensions.exception');
}

import { AuthChecker, MiddlewareFn, UnauthorizedError } from "type-graphql";
import * as jwt from 'jsonwebtoken';
import { tokenKey } from './config/keys'
import { UserJsonDocument } from "../../contexts/ClientAttention/Users/domain/Types/UserJsonDocument";
import { NextFunction, Request, Response } from "express";
import { Forbidden, GeneralError, Unauthorized } from "../../contexts/shared/domain/Errors";

export interface RequestTokenized  extends Request {
    user: UserJsonDocument;
}

export interface RequestContext {
    req: RequestTokenized
}

export const authChecker: MiddlewareFn<RequestContext> = async ({context: { req }}, next) =>{
    try {
        const token = <string>req.headers.authorization?.split(' ')[1];
        if(!token) return new Unauthorized("Token is ausent", 401);
        const userVerifiedToken = jwt.verify(token, tokenKey) as UserJsonDocument;
        req.user = userVerifiedToken;
        await next()
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError) throw new Unauthorized("Token is expired", 401)
        throw new Forbidden("Token is Invalid", 403);
    }
}

export const authMiddleWare = async (req: RequestTokenized, res: Response, next: NextFunction) => {
    try {
        const token = <string>req.headers.authorization?.split(' ')[1];
        if(!token) return next(new Unauthorized("Token is ausent", 401));
        const userVerifiedToken = jwt.verify(token, tokenKey) as UserJsonDocument;
        req.user = userVerifiedToken;
        next();
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError) return next(new Unauthorized("Token is expired", 401))
        return next(new Forbidden("Token is invalid", 403), )
    }
}
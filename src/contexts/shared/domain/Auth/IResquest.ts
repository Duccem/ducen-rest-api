import { UserJsonDocument } from "../../../ClientAttention/Users/domain/Types/UserJsonDocument";
import { Request } from "express";

export interface RequestTokenized  extends Request {
    user: UserJsonDocument;
}

export interface RequestContext {
    req: RequestTokenized
}
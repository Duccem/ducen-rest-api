import { Response, Request, NextFunction } from "express";
import { UserCommands } from "../../../contexts/ClientAttention/Users/application/UserCommands";
import { Repository } from "../../../contexts/shared/domain/Repositories/Repository";
import { EventBus } from "../../../contexts/shared/domain/DomainEvents/EventBus";

export class UserController {
    private userCommands: UserCommands
    constructor(repo: Repository, bus: EventBus){
        this.userCommands = new UserCommands(repo, bus);
    }
    public async signup(req:Request, res:Response, next: NextFunction){
        try {
			const response = await this.userCommands.signup(req.body);
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
    }
}
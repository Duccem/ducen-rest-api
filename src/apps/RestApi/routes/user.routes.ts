 
import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from "apps/RestApi/controllers/UserController";
import { Repository } from 'contexts/shared/domain/Repositories/Repository';
import { EventBus } from 'contexts/shared/domain/DomainEvents/EventBus';

const BASE_ROUTE = 'users';

export const register = (router:Router, repo: Repository, bus: EventBus) =>{
    const controller = new UserController(repo, bus);

    router.post(`${BASE_ROUTE}/signup/`, (req: Request, res: Response, next: NextFunction) => controller.signup(req,res,next));
}
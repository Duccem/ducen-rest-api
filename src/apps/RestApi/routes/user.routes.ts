 
import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from "../controllers/UserController";
import { Repository } from '../../../contexts/shared/domain/Repositories/Repository';
import { EventBus } from '../../../contexts/shared/domain/DomainEvents/EventBus';

const BASE_ROUTE = 'users';

export const register = (router:Router, repo: Repository, bus: EventBus) =>{
    const controller = new UserController(repo, bus);

    router.post('/users/signup', (req: Request, res: Response, next: NextFunction) => controller.signup(req,res,next));
}
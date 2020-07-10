import { Router, Request, Response, NextFunction } from "express";
import { AuthEntity } from "../../../Entities/Entity";

export class UserRouter {
	private controller: AuthEntity;
	private router: Router;
	constructor(controller: AuthEntity) {
		this.controller = controller;
		this.router = Router();
	}

	public getRouter(): Router {
		this.router.post("/signup", this.signup);
		this.router.post("/login", this.login);
		return this.router;
	}

	private async signup(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await this.controller.signup(req.body);
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	private async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { user, password } = req.body;
			const response = await this.controller.login(user, password);
		} catch (error) {
			next(error);
		}
	}
}

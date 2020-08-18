import { Router, Request, Response, NextFunction } from "express";
import { UserAuth } from "../application/UserAuth";

export class UserRouter {
	private controller: UserAuth;
	private router: Router;
	constructor(controller: UserAuth) {
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
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}
}

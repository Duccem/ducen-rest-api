import { Router, Request, Response, NextFunction } from "express";
import { UserAuth } from "../application/UserCommands";
import jwt from "jsonwebtoken";

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
			const token = jwt.sign({ _id: response._id }, "26778376", {
				expiresIn: 60 * 60 * 24,
			});
			return res.cookie('token', token, {expires: new Date(Date.now() + 60 * 60 * 24)})
						.status(200)
						.json(response);
		} catch (error) {
			next(error);
		}
	}

	private async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { user, password } = req.body;
			const response = await this.controller.login(user, password);
			const token = jwt.sign({ _id: response._id }, process.env.TOKEN_KEY || "2423503", {
				expiresIn: 60 * 60 * 24,
			});
			return res.cookie('token', token, {expires: new Date(Date.now() + 60 * 60 * 24)})
						.status(200)
						.json(response);
		} catch (error) {
			next(error);
		}
	}
}

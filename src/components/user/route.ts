import { Router, Request, Response, NextFunction } from "express";
import * as controller from "./controller";
const router = Router();

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { body } = req;
		let response = await controller.signup(body);
		return res.status(200).json(response);
	} catch (error) {
		next(error);
	}
});

router.post("/login/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		let { mail, password } = req.body;
		let response = await controller.login(mail, password);
		return res.status(200).json(response);
	} catch (error) {
		next(error);
	}
});

export default router;

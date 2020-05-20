import { InternalServerError } from "../errors";
import { Router, Request, Response } from "express";
import { APIController } from "./APIController";

/**
 * Class dedicated to handle the CRUD routes of one entity
 */
export class APIRouter {
	public router: Router;

	constructor(private controller: APIController) {
		this.router = Router();

		this.router.get(
			"/",
			async (req: Request, res: Response): Promise<Response> => {
				try {
					let { message, response, code } = await this.controller.list(req.query);
					return res.status(code).json(message || response);
				} catch (error) {
					console.log(error);
					return res.status(InternalServerError.code).json({ message: InternalServerError.message });
				}
			}
		);
		this.router.get(
			"/:id",
			async (req: Request, res: Response): Promise<Response> => {
				let { id } = req.params;
				try {
					let { message, response, code } = await this.controller.get(id, req.query);
					return res.status(code).json(message || response);
				} catch (error) {
					console.log(error);
					return res.status(InternalServerError.code).json({ message: InternalServerError.message });
				}
			}
		);
		this.router.post(
			"/",
			async (req: Request, res: Response): Promise<Response> => {
				try {
					let { message, response, code } = await controller.insert(req.body);
					return res.status(code).json(message || response);
				} catch (error) {
					console.log(error);
					return res.status(InternalServerError.code).json({ message: InternalServerError.message });
				}
			}
		);

		this.router.post(
			"/:id",
			async (req: Request, res: Response): Promise<Response> => {
				try {
					let { message, response, code } = await controller.upsert(req.params, req.body);
					return res.status(code).json(message || response);
				} catch (error) {
					console.log(error);
					return res.status(InternalServerError.code).json({ message: InternalServerError.message });
				}
			}
		);

		this.router.delete(
			"/:id",
			async (req: Request, res: Response): Promise<Response> => {
				try {
					let { message, code } = await controller.remove(req.params);
					return res.status(code).json(message);
				} catch (error) {
					console.log(error);
					return res.status(InternalServerError.code).json({ message: InternalServerError.message });
				}
			}
		);
	}
}

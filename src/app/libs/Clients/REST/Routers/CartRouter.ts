import { Router, Request, Response, NextFunction } from "express";
import { CrudEntity, DoubleEntity } from "../../../Entities/Entity";

export class CartRouter {
	private controller: CrudEntity & DoubleEntity;
	private router: Router;
	constructor(controller: CrudEntity & DoubleEntity) {
		this.controller = controller;
		this.router = Router();
	}
	public getRouter(): Router {
		this.router
			.get("/", this.list)
			.get("/:id", this.get)
			.post("/", this.insert)
			.post("/:id", this.update)
			.post("/:id/add", this.addDetail)
			.post("/:id", this.removeDetail)
			.delete("/:id", this.remove);
		return this.router;
	}

	private async list(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await this.controller.list(req.query);
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}
	private async get(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await this.controller.get(req.params.id, req.query);
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}
	private async insert(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await this.controller.insert({ userId: req.userId });
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}
	private async update(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await this.controller.update(req.params.id, req.body);
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}
	private async remove(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await this.controller.remove(req.params.id);
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	private async addDetail(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await this.controller.addDetail(req.params.id, req.body);
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	private async removeDetail(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await this.controller.removeDetail(req.params.id, req.body);
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}
}

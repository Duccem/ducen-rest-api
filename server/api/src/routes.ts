import { Application } from "express";
import { APIRouter } from "./libs/APIRouter";
import { APIController } from "./libs/APIController";

export const routes = (app: Application) => {
	app.use("/api/banco/", new APIRouter(new APIController("adm_banco", "banco")).router);
};

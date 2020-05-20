import { Application } from "express";
import { APIRouter } from "./libs/APIRouter";
import { APIController } from "./libs/APIController";
import { ConceptosController } from "./libs/APIController2";

export const routes = (app: Application) => {
	app.use("/api/banco/", new APIRouter(new APIController("adm_banco", "banco")).router);
	app.use("/api/cambio/", new APIRouter(new ConceptosController("adm_cambio", "cambio")).router);
};

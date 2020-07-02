////ARCHIVO DE CONFIGURACION DEL SERVIDOR
//Requerimos los modulos necesarios para la app
import express, { Application } from "express";
import path from "path";
import cors from "cors";
import ducentrace from "ducentrace";
import swaggerUI from "swagger-ui-express";

import { routes } from "./routes";

import logger from "./config/logger";
import { port } from "./config/keys";
import { errorHandler, RouteNotFound } from "./libs/errors";
import { swaggerDocument } from "./docs";
import { MySQLQueryMaker } from "./libs/Repositories/MySQLRepository/MySQLQueryMaker";

/**
 * Class of the principal application of the server
 * ```
 * const app = new App();
 * const app = new App(3000);
 * ```
 *
 */

export class App {
	public app: Application;
	/**
	 *
	 * @param port the number of the port where the app is started to listen
	 */
	constructor(private port?: number | string) {
		this.app = express();
		this.settings();
		this.middlewares();
		this.routes();
		this.errors();
	}

	private settings() {
		this.app.set("port", this.port || process.argv[2] || port || 80);
	}

	private middlewares() {
		this.app.use(cors({ exposedHeaders: "Authorization" }));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(ducentrace());
		this.app.use(
			"/",
			swaggerUI.serve,
			swaggerUI.setup(swaggerDocument, {
				customCss: ".swagger-ui .topbar { display: none }",
				customSiteTitle: "Ducen rest api",
			})
		);
		this.app.use((req, res, next) => {
			req.logger = logger;
			next();
		});
		this.app.use("/api/images/", express.static(path.resolve("public/images")));
	}

	private routes() {
		routes(this.app);
	}

	private errors() {
		this.app.use("*", (req, res, next) => {
			next(new RouteNotFound());
		});
		this.app.use(errorHandler);
	}

	/**
	 * Function to start the server
	 */
	public listen() {
		let server = this.app.listen(this.app.get("port"), "127.0.0.1");
		server.on("listening", () => {
			let address: any = server.address();
			logger.log(`Listening on http://${address.address}:${address.port}`, { type: "server", color: "system" });
			const query = new MySQLQueryMaker();
			const sql = query.findMany("products", {
				fields: "id,name,brand,price",
				include: [
					{
						table: "presentaciones",
						where: {
							["gte-multplicador"]: 2,
						},
					},
				],
			});
			console.log(sql);
		});
	}
}

////ARCHIVO DE CONFIGURACION DEL SERVIDOR
//Requerimos los modulos necesarios para la app
//Libraries
import express, { Application, Router } from "express";
//import path from "path";
import cors from "cors";
import ducentrace from "ducentrace";
//import swaggerUI from "swagger-ui-express";
import cookieParser from "cookie-parser";

//Own context app imports
import { registerRoutes } from "./routes/router";
import { registerObservers } from "./observers/observer";
import { port, database, messageQ } from "./config/keys";
//import { swaggerDocument } from "./docs";

//Shared context domain implematations
import { Logger } from "../../contexts/shared/infraestructure/Logger";
import { MongoDBRepoitory } from "../../contexts/shared/infraestructure/Repositories/MongoDBRepository/MongoDBRepository";
import { RabbitMQEventBus } from "../../contexts/shared/infraestructure/EventBus/RabbitMQEventBus";
import { errorHandler, RouteNotFound } from "../../contexts/shared/domain/Errors";

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
	public logger: Logger;
	/**
	 *
	 * @param port the number of the port where the app is started to listen
	 */
	constructor(private port?: number | string) {
		this.app = express();
		this.logger = new Logger()
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
		this.app.use(cookieParser());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(ducentrace());
		// this.app.use(
		// 	"/",
		// 	swaggerUI.serve,
		// 	swaggerUI.setup(swaggerDocument, {
		// 		customCss: ".swagger-ui .topbar { display: none }",
		// 		customSiteTitle: "Ducen rest api",
		// 	})
		// );
		this.app.use((req, _res, next) => {
			req.logger = this.logger;
			next();
		});
		// this.app.use("/api/images/", express.static(path.resolve("public/images")));
	}

	private routes() {
		RabbitMQEventBus.createConnectionChannel(messageQ)
			.then(async ({connection, channel}) =>{
				const mongoRepo = new MongoDBRepoitory(database, this.logger);
				await mongoRepo.setConnection();
				const rabbitBus = new RabbitMQEventBus([], connection, channel)
				const router = Router();
				registerRoutes(router, mongoRepo, rabbitBus);
				registerObservers(mongoRepo, rabbitBus);
			})
			.catch(err => console.log(err));
	}

	private errors() {
		this.app.use("*", (_req, _res, next) => {
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
		});
	}
}

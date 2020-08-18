import { Application } from "express";
import { Repository } from "components/shared/infraestructure/Repositories/Repository";

//Controllers imports
import { UserAuth } from "../../../Users/application/UserAuth";

//Routers imports
import { UserRouter } from "../../../Users/infraestructure/UserRouter";

export const routes = (app: Application, repository: Repository) => {
	//Controllers initializations
	const userController = new UserAuth(repository);

	//Router initializations
	const userRouter = new UserRouter(userController);

	//Routes
	app.use("/api/auth", userRouter.getRouter());
};

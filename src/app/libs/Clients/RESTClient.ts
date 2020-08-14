import { Application } from "express";
import { Repository } from "libs/Repositories/Repository";

//Controllers imports
import { UserAuth } from "../../components/Users/application/UserAuth";

//Routers imports
import { UserRouter } from "../../components/Users/infraestructure/UserRouter";

export const routes = (app: Application, repository: Repository) => {
	//Controllers initializations
	const userController = new UserAuth(repository);

	//Router initializations
	const userRouter = new UserRouter(userController);

	//Routes
	app.use("/api/auth", userRouter.getRouter());
};

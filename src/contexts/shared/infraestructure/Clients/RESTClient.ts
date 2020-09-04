import { Application } from "express";
import { Repository } from "contexts/shared/domain/Repositories/Repository";

//Controllers imports
import { UserAuth } from "../../../ClientAttention/Users/application/UserAuth";

//Routers imports
import { UserRouter } from "../../../ClientAttention/Users/infraestructure/UserRouter";

export const routes = (app: Application, repository: Repository) => {
	//Controllers initializations
	const userController = new UserAuth(repository);

	//Router initializations
	const userRouter = new UserRouter(userController);

	//Routes
	app.use("/api/auth", userRouter.getRouter());
};

import { Application } from "express";
import { Repository } from "libs/Repositories/Repository";
import auth from "../../Authentication";

//Controllers imports
import { User } from "../../../components/User";
import { Cart } from "../../../components/Cart";

//Routers imports
import { UserRouter } from "./Routers/UserRouter";
import { CartRouter } from "./Routers/CartRouter";

export const routes = (app: Application, repository: Repository) => {
	//Controllers initializations
	const userController = new User(repository);
	const cartController = new Cart(repository);

	//Router initializations
	const userRouter = new UserRouter(userController);
	const cartRouter = new CartRouter(cartController);

	//Routes
	app.use("/api/auth", userRouter.getRouter());
	app.use("/api/cart", auth(), cartRouter.getRouter());
};

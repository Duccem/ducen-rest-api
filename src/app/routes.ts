import { Application } from "express";
import auth from "./libs/Authentication";
import userRouter from "./components/user/route";

export const routes = (app: Application) => {
	app.use("/user/", userRouter);
};

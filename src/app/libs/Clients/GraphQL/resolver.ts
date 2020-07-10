import { Application } from "express";
import { Repository } from "libs/Repositories/Repository";
import auth from "../../Authentication";

//Controllers imports
import { User } from "../../../components/User";

//Routers imports
import { UserResolver } from "./resolvers/UserResolvers";

export const routes = (app: Application, repository: Repository) => {
	//Controllers initializations
	const userController = new User(repository);

	//Router initializations
	const userResolver = new UserResolver(userController);
	const resolvers = {
		Query: {},
		Mutation: {
			...userResolver.getMutations(),
		},
	};
};

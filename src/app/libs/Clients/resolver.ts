import { Application } from "express";
import { Repository } from "libs/Repositories/Repository";

//Controllers imports
import { UserAuth } from "../../components/Users/application/UserAuth";

//Routers imports
import { UserResolver } from "../../components/Users/infraestructure/UserResolvers";

export const resolvers = (app: Application, repository: Repository) => {
	//Controllers initializations
	const userController = new UserAuth(repository);

	//Router initializations
	const userResolver = new UserResolver(userController);
	const resolvers = {
		Query: {},
		Mutation: {
			...userResolver.getMutations(),
		},
	};
};

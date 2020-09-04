import { Application } from "express";
import { Repository } from "contexts/shared/domain/Repositories/Repository";

//Controllers imports
import { UserAuth } from "../../../ClientAttention/Users/application/UserAuth";

//Routers imports
import { UserResolver } from "../../../ClientAttention/Users/infraestructure/UserResolvers";

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

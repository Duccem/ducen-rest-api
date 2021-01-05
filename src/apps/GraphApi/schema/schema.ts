import "reflect-metadata";
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import path from 'path';

//resolvers 
import { AccessResolver } from './resolvers/access.resolvers'
import { Repository } from "../../../contexts/shared/domain/Repositories/Repository";
import { EventBus } from "../../../contexts/shared/domain/DomainEvents/EventBus";
import { JWTAuth } from '../../../contexts/ClientAttention/Users/infraestructure/JWTAuth'
import { GraphQLSchema } from "graphql";
import { tokenKey } from "../config/keys";

export default async (repository: Repository, eventBus?: EventBus): Promise<GraphQLSchema> => {
	Container.set("Repository", repository);
	Container.set("EventBus", eventBus);
	Container.set("Auth", new JWTAuth(tokenKey as string));
	return  await buildSchema({
		resolvers: [AccessResolver],
		container: Container,
		emitSchemaFile: path.resolve(__dirname, "schema.gql"),
	})
};
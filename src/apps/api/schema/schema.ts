import "reflect-metadata";
import { buildSchema } from 'type-graphql';
import { Container } from "typedi";
import path from 'path';
import { GraphQLSchema } from "graphql";
import { authChecker } from '../authMiddlewareTest'

//resolvers 
import { AccessResolver } from './resolvers/access.resolvers'
export default async (): Promise<GraphQLSchema> => {
	return  await buildSchema({
		resolvers: [AccessResolver],
		container: Container,
		emitSchemaFile: path.resolve(__dirname, "schema.gql")
	})
};
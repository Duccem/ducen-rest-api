////ARCHIVO DE CONFIGURACION DEL SERVIDOR
//Requerimos los modulos necesarios para la app
//Libraries
import express, { Application } from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import ducentrace from 'ducentrace';
import cookieParser from 'cookie-parser';

//Own imports
import schema from './schemas/schema';
import resolvers from './resolvers/index';

//Shared context domain implematations
import { Logger } from '../../contexts/shared/infraestructure/Logger';

/**
 * Class of the principal application of the server
 * ```
 * const app = new App();
 * const app = new App(3000);
 * ```
 *
 */

export class App {
	public app: Application;
	public logger: Logger;
	/**
	 *
	 * @param port the number of the port where the app is started to listen
	 */
	constructor(private port?: number | string) {
		this.app = express();
		this.logger = new Logger();
		this.settings();
		this.middlewares();
	}

	private settings() {
		this.app.set('port', this.port || process.argv[2] || process.env.PORT || 5000);
	}

	private middlewares() {
		this.app.use(cors({ exposedHeaders: 'Authorization' }));
		this.app.use(cookieParser());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(ducentrace());
		this.app.use((req, _res, next) => {
			req.logger = this.logger;
			next();
		});
		const server = new ApolloServer({
			typeDefs: gql(schema),
			resolvers,
			context: ({ req }) => {
				return { req };
			},
			playground: true,
			introspection: true,
		});
		server.applyMiddleware({ app: this.app, path: '/graphql' });
	}

	/**
	 * Function to start the server
	 */
	public listen() {
		let server = this.app.listen(this.app.get('port'), '0.0.0.0');
		server.on('listening', () => {
			let address: any = server.address();
			this.logger.log(`🚀 Listening on http://${address.address}:${address.port}`, { color: 'warning', type: 'server' });
		});
	}
}

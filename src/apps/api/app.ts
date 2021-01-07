////ARCHIVO DE CONFIGURACION DEL SERVIDOR
//Requerimos los modulos necesarios para la app
//Libraries
import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import ducentrace from 'ducentrace';
import cookieParser from 'cookie-parser';

//Own imports
import makeSchema from './schema/schema';

//Shared context domain implematations
import { Logger } from '../../contexts/shared/infraestructure/Logger';
import { graphQLErrorHandler } from '../../contexts/shared/domain/Errors';
import { connect } from './config/connections';
import { database } from './config/keys';
import { setContainer } from './config/container';
import { registerObservers } from './schema/observers/observer';

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
		this.intialize().then(({ repository, schema })=>{
			const server = new ApolloServer({
				schema,
				context: ({ req }) => {
					return { req };
				},
				playground: true,
				introspection: true,
				formatError: graphQLErrorHandler(this.logger)
			});
			server.applyMiddleware({ app: this.app, path: '/graphql' });
		}).catch((error)=>{
			console.log(error);
		})
	}

	private async intialize(){
		const { repository, eventBus } = await connect(this.logger)(database)
		setContainer(repository, eventBus);
		registerObservers();
		const schema = await makeSchema();
		return {repository, schema};
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

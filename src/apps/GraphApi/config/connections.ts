import { Repository } from '../../../contexts/shared/domain/Repositories/Repository';
import { EventBus } from '../../../contexts/shared/domain/DomainEvents/EventBus';
import { MongoDBRepoitory } from '../../../contexts/shared/infraestructure/Repositories/MongoDBRepository/MongoDBRepository';
import { InMemoryAsyncEventBus } from '../../../contexts/shared/infraestructure/EventBus/InMemoryAsyncEventBus/InMemoryAsyncEventBus';
// import { RabbitMQEventBus } from '../../../contexts/shared/infraestructure/EventBus/RabbitMQEventBus/RabbitMQEventBus';
import { GeneralError } from '../../../contexts/shared/domain/Errors';
import { Logger } from '../../../contexts/shared/infraestructure/Logger';

export type Connections = {
	repository: Repository;
	eventBus: EventBus;
};

export const connect = (logger: Logger) => async (database: any, queue?: any): Promise<Connections> => {
	try {
		let repository = new MongoDBRepoitory(database);
		let eventBus = new InMemoryAsyncEventBus([]);
		await repository.setConnection();
		// let { connection, channel }: any = await RabbitMQEventBus.createConnectionChannel(queue, logger);
		// let eventBus = new RabbitMQEventBus([], connection, channel);
		// let eventBus = new InMemoryAsyncEventBus([]);
		return {
			repository,
			eventBus
		};
	} catch (error) {
		throw new GeneralError('Error al establecer conexiones');
	}
};

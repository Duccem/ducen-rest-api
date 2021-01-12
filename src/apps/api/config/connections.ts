import { Repository } from '../../../contexts/shared/domain/Repositories/Repository';
import { EventBus } from '../../../contexts/shared/domain/DomainEvents/EventBus';
import { MongoDBRepoitory } from '../../../contexts/shared/infraestructure/Repositories/MongoDBRepository/MongoDBRepository';
import { InMemoryAsyncEventBus } from '../../../contexts/shared/infraestructure/EventBus/InMemoryAsyncEventBus/InMemoryAsyncEventBus';
import { RabbitMQEventBus } from '../../../contexts/shared/infraestructure/EventBus/RabbitMQEventBus/RabbitMQEventBus';
import { GeneralError } from '../../../contexts/shared/domain/Errors';
import { Logger } from '../../../contexts/shared/infraestructure/Logger';

export type Connections = {
	repository: Repository;
	eventBus: EventBus;
};

export const connect = (logger: Logger) => async (database: any, queue?: any): Promise<Connections> => {
	try {
		let repository = new MongoDBRepoitory(database);
		let eventBus = new RabbitMQEventBus([]);
		let eventBus2 = new InMemoryAsyncEventBus([]);
		await repository.setConnection();
		await eventBus.setConnection(queue, logger);
		return {
			repository,
			eventBus
		};
	} catch (error) {
		throw new GeneralError('Error al establecer conexiones');
	}
};

import { DomainEvent } from 'contexts/shared/domain/DomainEvents/DomainEvent';
import { DomainEventSubscriber } from 'contexts/shared/domain/DomainEvents/DomainEventSubscriber';
import { EventBus } from 'contexts/shared/domain/DomainEvents/EventBus';
import { RabbitMQEventEmitterBus } from './RabbitMQEventEmitterBus';
import { connect, Channel, Connection } from 'amqplib';
import { Logger } from '../../Logger';

export class RabbitMQEventBus implements EventBus {
	private bus: RabbitMQEventEmitterBus;
	constructor(subscribers: Array<DomainEventSubscriber>) {
		this.bus = new RabbitMQEventEmitterBus(subscribers);
	}

	public async setConnection(config: any, logger: Logger): Promise<any> {
		let connection = await connect(config.host);
		let channel = await connection.createChannel();
		this.bus.setChannel(channel);
		logger.log(`connected to the host ${config.host}`, { type: 'message', color: 'system' });
	}

	async publish(events: DomainEvent[]): Promise<void> {
		this.bus.publish(events);
	}

	addSubscribers(subscribers: Array<DomainEventSubscriber>) {
		this.bus.registerSubscribers(subscribers);
	}
}

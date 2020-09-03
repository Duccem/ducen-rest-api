import { DomainEvent } from 'components/shared/domain/DomainEvents/DomainEvent';
import { DomainEventSubscriber } from 'components/shared/domain/DomainEvents/DomainEventSubscriber';
import { EventBus } from 'components/shared/domain/DomainEvents/EventBus';
import { EventEmitterBus } from './EventEmitterBus';
import { connect, Channel, Connection } from "amqplib";

export class RabbitMQEventBus implements EventBus {
    private bus: EventEmitterBus;
    private connection: Connection;
    constructor(subscribers: Array<DomainEventSubscriber<DomainEvent>>, connection: Connection, channel: Channel) {
        this.bus = new EventEmitterBus(subscribers, channel);
        this.connection = connection;
    }

    public static async createConnectionChannel(): Promise<any>{
        let connection = await connect('');
        let channel = await connection.createChannel();
        return { connection, channel };
    }

    async publish(events: DomainEvent[]): Promise<void> {
        this.bus.publish(events);
    }

    addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent>>) {
        this.bus.registerSubscribers(subscribers);
    }
}
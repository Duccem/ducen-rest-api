import { DomainEvent } from 'contexts/shared/domain/DomainEvents/DomainEvent';
import { DomainEventSubscriber } from 'contexts/shared/domain/DomainEvents/DomainEventSubscriber';
import { EventBus } from 'contexts/shared/domain/DomainEvents/EventBus';
import { EventEmitterBus } from './EventEmitterBus';
import { connect, Channel, Connection } from "amqplib";

export class RabbitMQEventBus implements EventBus {
    private bus: EventEmitterBus;
    private connection: Connection;
    constructor(subscribers: Array<DomainEventSubscriber>, connection: Connection, channel: Channel) {
        this.bus = new EventEmitterBus(subscribers, channel);
        this.connection = connection;
    }

    public static async createConnectionChannel(config: any): Promise<any>{
        let connection = await connect(config.host);
        let channel = await connection.createChannel();
        console.log('Connected to rabbit');
        return { connection, channel };
    }

    async publish(events: DomainEvent[]): Promise<void> {
        this.bus.publish(events);
    }

    addSubscribers(subscribers: Array<DomainEventSubscriber>) {
        this.bus.registerSubscribers(subscribers);
    }
}
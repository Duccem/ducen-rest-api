
import { Channel } from "amqplib";
import { DomainEvent } from '../../domain/DomainEvents/DomainEvent';
import { DomainEventSubscriber } from '../../domain/DomainEvents/DomainEventSubscriber';


export class EventEmitterBus  {
    private channel: Channel;
    constructor(subscribers: Array<DomainEventSubscriber>,channel: Channel) {
        this.channel = channel
        this.registerSubscribers(subscribers);
    }    

    public registerSubscribers(subscribers: DomainEventSubscriber[]) {
        subscribers.map(subscriber => {
            this.registerSubscriber(subscriber);
        });
    }

    private registerSubscriber(subscriber: DomainEventSubscriber) {
        subscriber.subscribedTo().map( async (event) => {
            await this.channel.assertQueue(event.EVENT_NAME)
            this.channel.consume(event.EVENT_NAME, (msg) => {
                subscriber.on(event.fromPrimitives(JSON.parse(msg ? msg.content.toString() as string : '')));
            });
        });
    }

    public publish(events: DomainEvent[]): void {
        events.map(event => this.channel.sendToQueue(event.eventName, new Buffer(JSON.stringify(event.toPrimitive()))));
    }
}
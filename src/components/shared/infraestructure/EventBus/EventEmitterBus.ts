
import { Channel } from "amqplib";
import { DomainEvent } from 'components/shared/domain/DomainEvents/DomainEvent';
import { DomainEventSubscriber } from 'components/shared/domain/DomainEvents/DomainEventSubscriber';


export class EventEmitterBus  {
    private channel: Channel;
    constructor(subscribers: Array<DomainEventSubscriber<DomainEvent>>,channel: Channel) {
        this.channel = channel
        this.registerSubscribers(subscribers);
    }    

    public registerSubscribers(subscribers?: DomainEventSubscriber<DomainEvent>[]) {
        subscribers?.map(subscriber => {
            this.registerSubscriber(subscriber);
        });
    }

    private registerSubscriber(subscriber: DomainEventSubscriber<DomainEvent>) {
        subscriber.subscribedTo().map(event => {
            this.channel.consume(event.EVENT_NAME, (msg) => {
                subscriber.on(event.fromPrimitives(JSON.parse(msg?.content.toString() as string)));
            });
        });
    }

    public publish(events: DomainEvent[]): void {
        events.map(event => this.channel.sendToQueue(event.eventName, new Buffer(JSON.stringify(event.toPrimitive()))));
    }
}
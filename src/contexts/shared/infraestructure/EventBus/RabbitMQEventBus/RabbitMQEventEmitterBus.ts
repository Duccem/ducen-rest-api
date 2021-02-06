import { Channel } from 'amqplib';
import { DomainEvent } from '../../../domain/DomainEvents/DomainEvent';
import { DomainEventSubscriber } from '../../../domain/DomainEvents/DomainEventSubscriber';

export class RabbitMQEventEmitterBus {
	private channel?: Channel;
	private subscribers: Array<DomainEventSubscriber> = [];
	constructor() {}

	public registerSubscribers(subscribers: DomainEventSubscriber[]) {
		subscribers.map((subscriber) => {
			this.registerSubscriber(subscriber);
		});
	}

	public setChannel(channel: Channel) {
		this.channel = channel;
		this.registerSubscribers(this.subscribers);
	}

	private registerSubscriber(subscriber: DomainEventSubscriber) {
		if (!this.channel) return;
		this.subscribers.push(subscriber);
		subscriber.subscribedTo().map(async (event) => {
			await this.channel?.assertQueue(event.EVENT_NAME);
			this.channel?.consume(event.EVENT_NAME, (msg) => {
				subscriber.on(event.fromPrimitives(JSON.parse(msg ? (msg.content.toString() as string) : '')));
			});
		});
	}

	public publish(events: DomainEvent[]): void {
		events.map((event) => this.channel?.sendToQueue(event.eventName, Buffer.from(JSON.stringify(event.toPrimitive()))));
	}
}

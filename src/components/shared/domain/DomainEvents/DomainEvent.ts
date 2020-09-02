import { UuidValueObject } from '../ValueObjects/UuidValueObject';

export abstract class DomainEvent {
  static EVENT_NAME: string;
  readonly entityId: string;
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;

  constructor(eventName: string, entityId: string, eventId?: string, occurredOn?: Date) {
    this.entityId = entityId;
    this.eventId = eventId || UuidValueObject.random().value;
    this.occurredOn = occurredOn || new Date();
    this.eventName = eventName;
  }

  public abstract toPrimitive(): Object;
}

export type DomainEventClass = { EVENT_NAME: string, fromPrimitives(...args: any[]): DomainEvent; };
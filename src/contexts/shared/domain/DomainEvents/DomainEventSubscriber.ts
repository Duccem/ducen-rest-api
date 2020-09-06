import { DomainEvent, DomainEventClass } from './DomainEvent';

export interface DomainEventSubscriber {
  subscribedTo(): Array<DomainEventClass>;

  on(domainEvent: DomainEvent): Promise<void>;
}
import { DomainEvent } from "components/shared/domain/DomainEvents/DomainEvent";
import { DomainEventMapping } from './DomainEventMapping';

export class DomainEventJsonDeserializer {
    private mapping: DomainEventMapping;

    constructor(mapping: DomainEventMapping) {
        this.mapping = mapping;
    }

    public deserialize(event: string): DomainEvent {
        const eventData = JSON.parse(event).data;
        const eventName = eventData.type;
        const eventClass = this.mapping.for(eventName);

        if (!eventClass) {
            throw new Error(`The event ${eventName} doesn't exist or has no subscribers`);
        }

        return eventClass.fromPrimitives(
            eventData.attributes.id,
            eventData.attributes,
            eventData.id,
            eventData.occurred_on
        );
    }
}
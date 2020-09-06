import { Repository } from "contexts/shared/domain/Repositories/Repository";
import { EventBus } from "contexts/shared/domain/DomainEvents/EventBus";
import { DomainEventSubscriber } from "contexts/shared/domain/DomainEvents/DomainEventSubscriber";
import { DomainEventClass, DomainEvent } from "contexts/shared/domain/DomainEvents/DomainEvent";
import { UserCreatedDomainEvent } from "contexts/ClientAttention/Users/domain/DomainEvents/UserCreatedDomainEvent";
import { EmailSender } from "./EmailSender";
import { Sender } from "../domain/Sender";

export class EmailEventsSubscriber implements DomainEventSubscriber {
    private emailSender: EmailSender;
    constructor(repoository: Repository, bus: EventBus, sender: Sender){
        this.emailSender = new EmailSender(repoository, bus, sender);
    }
    public subscribedTo(): Array<DomainEventClass>{
        return [UserCreatedDomainEvent]
    }

    public async on(domainEvent: DomainEvent){
        if(domainEvent instanceof UserCreatedDomainEvent){
            await this.emailSender.sendRegisterEmail(domainEvent.toPrimitive());
        }
    }
}
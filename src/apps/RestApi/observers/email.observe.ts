import { Repository } from "../../../contexts/shared/domain/Repositories/Repository";
import { EventBus } from "../../../contexts/shared/domain/DomainEvents/EventBus";
import { EmailEventsSubscriber } from "../../../contexts/ClientAttention/Emails/application/EmailEventsSubscriber";
import { NodeMailerSender } from "../../../contexts/ClientAttention/Emails/infraestructure/NodeMailerSender";

import { email } from "../config/keys";

export function register(repo: Repository, bus: EventBus){
    console.log(email);
    const sender = new NodeMailerSender(email)
    const emailEventSubscriber = new EmailEventsSubscriber(repo, bus, sender)
    return emailEventSubscriber;
}
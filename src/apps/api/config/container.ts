import { Container } from 'typedi';
import { Repository } from "../../../contexts/shared/domain/Repositories/Repository";
import { EventBus } from "../../../contexts/shared/domain/DomainEvents/EventBus";
import { JWTAuth } from '../../../contexts/ClientAttention/Users/infraestructure/JWTAuth'
import { NodeMailerSender } from '../../../contexts/ClientAttention/Emails/infraestructure/NodeMailerSender';

import { tokenKey, email } from "../config/keys";

export function setContainer(repository: Repository, eventBus: EventBus){
    Container.set("Repository", repository);
    Container.set("EventBus", eventBus);
    Container.set("Auth", new JWTAuth(tokenKey as string));
    Container.set("EmailSender", new NodeMailerSender(email));
}
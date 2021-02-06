import { Container } from 'typedi';
import { JWTAuth } from '../../../contexts/ClientAttention/Users/infraestructure/JWTAuth'
import { NodeMailerSender } from '../../../contexts/ClientAttention/Emails/infraestructure/NodeMailerSender';

import { tokenKey, email } from "../config/keys";
import { Connections } from './connections';

export function setContainer({ repository, eventBus, cacher, logger }: Connections){
    Container.set("Repository", repository);
    Container.set("EventBus", eventBus);
    Container.set("Cacher", cacher);
    Container.set("Auth", new JWTAuth(tokenKey as string));
    Container.set("EmailSender", new NodeMailerSender(email));
    Container.set("Logger", logger);
}
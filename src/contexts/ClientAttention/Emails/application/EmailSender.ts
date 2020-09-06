//shared imports
import { Repository } from "contexts/shared/domain/Repositories/Repository";
import { EventBus } from "contexts/shared/domain/DomainEvents/EventBus";

//Own context imports
import { Emails } from "contexts/ClientAttention/Emails/domain/Email";
import { Sender } from "contexts/ClientAttention/Emails/domain/Sender";
import { EmailJsonDocument } from "contexts/ClientAttention/Emails/domain/Types/EmailJsonDocument";
import { EmailSendedDomainEvent } from "contexts/ClientAttention/Emails/domain/DomainEvents/EmailSendedDomainEvent";

export class EmailSender{
    constructor(private repoository: Repository, private bus: EventBus, private sender: Sender){}

    public async sendRegisterEmail(data: any){
        let dataEmail: EmailJsonDocument = {
            subject: 'New user registered',
            reciver: data.email,
            sender: this.sender.sender,
            content: Emails.registeredEmailContent()
        };

        const email = new Emails(dataEmail);
        await Promise.all([
            this.sender.send(email.reciver, email.subject, email.content),
            this.repoository.insert('emails', email.toPrimitives())
        ]);
        const emailSendedEvent = new EmailSendedDomainEvent({
            entityId: email._id.toString(),
            email: email.reciver,
            username: data.username
        })
        email.record(emailSendedEvent);
        await this.bus.publish(email.pullDomainEvents());
        return email.toPrimitives();
    }
}
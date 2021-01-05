
import { DomainEventSubscriber } from '../../../shared/domain/DomainEvents/DomainEventSubscriber';
import { DomainEventClass, DomainEvent } from '../../../shared/domain/DomainEvents/DomainEvent';
import { UserCreatedDomainEvent } from '../../Users/domain/DomainEvents/UserCreatedDomainEvent';
import { PaymentCreatedDomainEvent } from '../../../Finnance/Pays/domain/DomainEvents/PaymentCreatedDomainEvent';
import { EmailCreator } from './EmailCreator';
import { Inject, Service } from 'typedi';

@Service("EmailSubscriber")
export class EmailEventsSubscriber implements DomainEventSubscriber {
	constructor(@Inject("EmailCreator") private emailSender: EmailCreator) {}

	public subscribedTo(): Array<DomainEventClass> {
		return [UserCreatedDomainEvent, PaymentCreatedDomainEvent];
	}

	public async on(domainEvent: DomainEvent) {
		if (domainEvent instanceof UserCreatedDomainEvent) {
			await this.emailSender.sendRegisterEmail(domainEvent.toPrimitive());
		} else if (domainEvent instanceof PaymentCreatedDomainEvent) {
			await this.emailSender.sendPaymentEmail(domainEvent.toPrimitive());
		}
	}
}

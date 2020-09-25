import { Repository } from '../../../shared/domain/Repositories/Repository';
import { EventBus } from '../../../shared/domain/DomainEvents/EventBus';
import { DomainEventSubscriber } from '../../../shared/domain/DomainEvents/DomainEventSubscriber';
import { DomainEventClass, DomainEvent } from '../../../shared/domain/DomainEvents/DomainEvent';
import { PaymentCreatedDomainEvent } from '../../../Finnance/Pays/domain/DomainEvents/PaymentCreatedDomainEvent';
import { UserCommands } from './UserCommands';
import { Auth } from '../domain/Auth';

export class UserEventsSubscriber implements DomainEventSubscriber {
	private userCommands: UserCommands;
	constructor(repository: Repository, bus: EventBus, auth: Auth) {
		this.userCommands = new UserCommands(repository, bus, auth);
	}
	public subscribedTo(): Array<DomainEventClass> {
		return [PaymentCreatedDomainEvent];
	}
	public async on(domainEvent: DomainEvent) {
		if (domainEvent instanceof PaymentCreatedDomainEvent) {
			await this.userCommands.userPayment(domainEvent.toPrimitive());
		}
	}
}

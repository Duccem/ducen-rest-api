import { DomainEvent } from '../../../../shared/domain/DomainEvents/DomainEvent';
import { PaymentCreatedDomainEventBody } from '../Types/PaymentCreatedDomainEventBody';

export class PaymentCreatedDomainEvent extends DomainEvent {
	static readonly EVENT_NAME = 'payment.created';
	readonly amount: number;
	readonly user_id: string;

	constructor(body: PaymentCreatedDomainEventBody, eventId?: string, ocurredOn?: Date) {
		super(PaymentCreatedDomainEvent.EVENT_NAME, body._id, eventId, ocurredOn);
		this.amount = body.amount;
		this.user_id = body.user_id;
	}

	public toPrimitive(): PaymentCreatedDomainEventBody {
		return {
			_id: this.entityId,
			amount: this.amount,
			user_id: this.user_id,
		};
	}

	public static fromPrimitives(object: any): PaymentCreatedDomainEvent {
		return new PaymentCreatedDomainEvent(object);
	}
}

export type PaymentCreatedDomainEventBody = {
	readonly _id: string;
	readonly amount: number;
	readonly user_id: string;
};

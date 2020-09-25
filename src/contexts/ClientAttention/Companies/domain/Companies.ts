import { Entity } from '../../../shared/domain/Entity';
import { CompanyJsonDocument } from './Types/CompanyJsonDocument';
import { UuidValueObject } from '../../../shared/domain/ValueObjects/UuidValueObject';

export class Company extends Entity {
	public _id: UuidValueObject;
	public business_name: string;
	public rif: string;
	public address: string;
	public routes: Array<string>;
	public daily_profit: number;
	public daily_spend: number;

	constructor(initObject: CompanyJsonDocument) {
		super();
		this._id = initObject._id ? new UuidValueObject(initObject._id) : UuidValueObject.random();
		this.business_name = initObject.business_name;
		this.rif = initObject.rif;
		this.address = initObject.address;
		this.routes = new Array<string>();
		this.daily_profit = initObject.daily_profit;
		this.daily_spend = initObject.daily_spend;
	}

	public toPrimitives(): CompanyJsonDocument {
		return {
			_id: this._id.toString(),
			business_name: this.business_name,
			rif: this.rif,
			address: this.address,
			routes: this.routes,
			daily_profit: this.daily_profit,
			daily_spend: this.daily_spend,
		};
	}
}

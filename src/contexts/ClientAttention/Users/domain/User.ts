import { Password } from "./ValueObjects/Password";
import { UserJsonDocument } from "./Types/UserJsonDocument";
import { UuidValueObject } from "../../../shared/domain/ValueObjects/UuidValueObject";
import { UserBirthDate } from "./ValueObjects/UserBirthDate";
import { Email } from "./ValueObjects/Email";
import { Entity } from "contexts/shared/domain/Entity";
//Principal class of Users
export class User  extends Entity{
	public _id?: UuidValueObject;
	public firstname: string;
	public lastname: string;
	public username: string;
	public password: Password;
	public email: Email;
	public birthdate: UserBirthDate;
	public sex: string;
	public age?: number;
	public adress?: string;
	public photo?: string;
	public money: number;
	public travels: number;
	public daily_travels: number;
	public daily_spend: number; 

	constructor(initObject: UserJsonDocument) {
		super()
		this._id = initObject._id ? new UuidValueObject(initObject._id) : UuidValueObject.random();
		this.firstname = initObject.firstname;
		this.lastname = initObject.lastname;
		this.username = initObject.username;
		this.password = new Password(initObject.password);
		this.email = new Email(initObject.email);
		this.birthdate = new UserBirthDate(initObject.birthdate);
		this.sex = initObject.sex;
		this.adress = initObject.adress;
		this.photo = initObject.photo;
		this.money = initObject.money;
		this.travels = initObject.travels;
		this.daily_travels = initObject.daily_travels;
		this.daily_spend = initObject.daily_spend;
	}


	public toPrimitives(): UserJsonDocument {
		return {
			_id: this._id?.toString(),
			firstname: this.firstname,
			lastname: this.lastname,
			username: this.username,
			password: this.password.toString(),
			email: this.email.toString(),
			birthdate: this.birthdate.toString(),
			sex: this.sex,
			adress: this.adress,
			photo: this.photo,
			money: this.money,
			travels: this.travels,
			daily_travels: this.daily_travels,
			daily_spend: this.daily_spend
		};
	}
}

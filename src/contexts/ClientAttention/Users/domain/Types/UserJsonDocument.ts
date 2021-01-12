import { JsonDocument } from "../../../../shared/domain/Types/JsonDocument";
import { Email } from "../ValueObjects/Email";
import { Password } from "../ValueObjects/Password";
import { UserBirthDate } from "../ValueObjects/UserBirthDate";

export type UserJsonDocument = JsonDocument & {
	personalData: {
		username: string;
		password:  string;
		email: string;
		firstname: string;
		lastname: string;
		birthdate: string;
		sex: string;
		age?: number;
		adress?: string;
		photo?: string;
	};
	configurationData: {
		tenantId: string;
		timezone: string;
		lang: string;
	};
	administrativeData: {
		money: number,
		travels: number,
		daily_travels: number,
		daily_spend: number,
	};
	profiles?:string[],
	token?: string
};

export interface UserAdministrativeData  {
	money: number,
	travels: number,
	daily_travels: number,
	daily_spend: number,
}

export interface UserPersonalData  {
	username: string;
	password: Password;
	email: Email;
	firstname: string;
	lastname: string;
	birthdate: UserBirthDate;
	sex: string;
	age?: number;
	adress?: string;
	photo?: string;
}


export interface UserConfigurationData  {
	tenantId: string;
	timezone: string;
	lang: string;
}
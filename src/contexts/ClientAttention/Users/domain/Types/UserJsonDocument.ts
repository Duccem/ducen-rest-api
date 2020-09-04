import { JsonDocument } from "../../../../shared/domain/Types/JsonDocument";

export type UserJsonDocument = JsonDocument & {
	firstname: string;
	lastname: string;
	username: string;
	password: string;
	email: string;
	birthdate: string;
	sex: string;
	age?: number;
	adress?: string;
	photo?: string;
	money: number;
	travels: number;
	daily_travels: number;
	daily_spend: number;
};



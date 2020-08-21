import { Password } from "./ValueObjects/Password";
import { UserJsonDocument } from "./Types/UserJsonDocument";
import { UuidValueObject } from "../../shared/domain/ValueObjects/UuidValueObject";
import { UserBirthDate } from "./ValueObjects/UserBirthDate";
import { Email } from "./ValueObjects/Email";
//Principal class of Users
export class User {
	public id?: UuidValueObject;
	public nombres: string;
	public apellidos: string;
	public fecha_nacimiento: UserBirthDate;
	public sexo: string;
	public direccion: string;
	public usuario: string;
	public password: Password;
	public email: Email;

	constructor(initObject: UserJsonDocument) {
		this.id = initObject.id ? new UuidValueObject(initObject.id) : undefined;
		this.nombres = initObject.nombres;
		this.apellidos = initObject.apellidos;
		this.fecha_nacimiento = new UserBirthDate(initObject.fecha_nacimiento);
		this.sexo = initObject.sexo;
		this.direccion = initObject.direccion;
		this.usuario = initObject.usuario;
		this.password = new Password(initObject.password);
		this.email = new Email(initObject.email);
	}


	public toPrimitives(): UserJsonDocument {
		return {
			id: this.id?.toString(),
			nombres: this.nombres,
			apellidos: this.apellidos,
			fecha_nacimiento: this.fecha_nacimiento.toString(),
			sexo: this.sexo,
			direccion: this.direccion,
			usuario: this.usuario,
			password: this.password.valueOf(),
			email: this.email.toString(),
			edad: this.fecha_nacimiento.calculateAge()
		};
	}
}

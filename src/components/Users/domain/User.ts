import { Password } from "./Password";
import { UserJsonDocument } from "./UserDocument";
//Principal class of Users
export class User {
	public id?: number;
	public nombres: string;
	public apellidos: string;
	public fecha_nacimiento: Date;
	public sexo: string;
	public direccion: string;
	public usuario: string;
	public password: Password;
	public edad?: number;

	constructor(initObject: UserJsonDocument) {
		this.id = initObject.id;
		this.nombres = initObject.nombres;
		this.apellidos = initObject.apellidos;
		this.fecha_nacimiento = new Date(initObject.fecha_nacimiento);
		this.sexo = initObject.sexo;
		this.direccion = initObject.direccion;
		this.usuario = initObject.usuario;
		this.password = new Password(initObject.password);
		this.edad = this.calcularEdad();
	}

	public calcularEdad(): number {
		let today = new Date();
		let birthdate = new Date(this.fecha_nacimiento);
		let edad = today.getFullYear() - birthdate.getFullYear();
		let m = today.getMonth() - birthdate.getMonth();

		if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
			edad--;
		}

		return edad;
	}

	public toPrimitives(): UserJsonDocument {
		return {
			id: this.id,
			nombres: this.nombres,
			apellidos: this.apellidos,
			fecha_nacimiento: this.fecha_nacimiento.toDateString(),
			sexo: this.sexo,
			direccion: this.direccion,
			usuario: this.usuario,
			password: this.password.valueOf(),
		};
	}
}

import { JsonDocument } from "../../shared/domain/Types/JsonDocument";

export type UserJsonDocument = JsonDocument & {
	nombres: string;
	apellidos: string;
	fecha_nacimiento: string;
	sexo: string;
	direccion: string;
	usuario: string;
	password: string;
};

export type AuthJsonDocument = {
	token: string;
	user: UserJsonDocument;
};

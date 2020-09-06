import dotenv from "dotenv";
dotenv.config();

export const database = {
	database: process.env.DATABASE_NAME || "",
	user: process.env.DATABASE_USER || "",
	password: process.env.DATABASE_PASSWORD || "",
	host: process.env.DATABASE_HOST || "",
};

export const messageQ = {
	host: process.env.MESSAGE_Q_HOST
}

export const email = {
	email: process.env.EMAIL,
	password: process.env.EMAIL_PASSWORD,
	port: process.env.EMAIL_PORT
}
export const tokenKey = process.env.TOKEN_KEY;
export const port = process.env.PORT;

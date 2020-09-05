import dotenv from "dotenv";
dotenv.config();

export const database = {
	name: process.env.DATABASE_NAME || "",
	user: process.env.DATABASE_USER || "",
	password: process.env.DATABASE_PASSWORD || "",
	host: process.env.DATABASE_HOST || "",
};

export const messageQ = {
	host: process.env.MESSAGE_Q_HOST
}
export const tokenKey = process.env.TOKEN_KEY;
export const port = process.env.PORT;

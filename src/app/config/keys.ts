import dotenv from "dotenv";
dotenv.config();

export const database = {
	name: process.env.DATABASE_NAME || "",
	user: process.env.DATABASE_USER || "",
	password: process.env.DATABASE_PASSWORD || "",
	host: process.env.DATABASE_HOST || "",
};
export const tokenKey = process.env.TOKEN_KEY;
export const dataURL = process.env.DATA_URL;
export const authURL = process.env.AUTH_URL;
export const port = process.env.PORT;

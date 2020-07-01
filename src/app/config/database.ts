import { Sequelize } from "sequelize";
import { database } from "./keys";

export const sequelize = new Sequelize(database.name, database.user, database.password, {
	dialect: "mysql",
	host: database.host,
	logging: false,
});

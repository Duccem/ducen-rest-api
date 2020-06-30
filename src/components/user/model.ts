import { sequelize } from "../../config/database";
import Sequelize, { Model } from "sequelize";
//import Product from "./Product";
class User extends Model {}
User.init(
	{
		id: { type: Sequelize.INTEGER, primaryKey: true },
		name: { type: Sequelize.TEXT },
		email: { type: Sequelize.TEXT },
		password: { type: Sequelize.TEXT },
	},
	{ sequelize, modelName: "user", timestamps: false }
);

// User.hasMany(Product, { foreignKey: "userId", sourceKey: "id" });
// Product.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

export default User;

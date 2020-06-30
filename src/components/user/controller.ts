import User from "./model";
import { tokenKey } from "../../config/keys";
import { BadRequest, Unauthorized } from "../../libs/errors";
import { Authentication } from "../../libs/Authentication";
import jwt from "jsonwebtoken";

export async function signup(newUser: any) {
	let count = await User.count({ where: { email: newUser.email } });

	if (count > 0) throw new BadRequest("The email is already in use");
	if (newUser.password.length <= 6) throw new BadRequest("The password must be longer than 6 characters.");

	newUser.password = await Authentication.passwordEncript(newUser.password);

	const createdUser: any = await User.create(newUser);
	const token = jwt.sign({ _id: createdUser.null }, tokenKey || "26778376", {
		expiresIn: 60 * 60 * 24,
	});

	return {
		token,
		user: {
			id: createdUser.null,
			name: newUser.name,
			email: newUser.email,
		},
	};
}

export async function login(mail: string, password: string) {
	const user: any = await User.findOne({ where: { $or: { name: mail, email: mail } } });
	if (!user) throw new Unauthorized("User not found");

	let valid = await Authentication.passwordCompare(password, user.password);
	if (!valid) throw new Unauthorized("Oops! incorrect password");

	const token = jwt.sign({ _id: user.id }, process.env.TOKEN_KEY || "2423503", { expiresIn: 60 * 60 * 24 });
	return {
		token,
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
		},
	};
}

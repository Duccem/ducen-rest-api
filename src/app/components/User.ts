import jwt from "jsonwebtoken";
import { AuthEntity } from "../libs/Entities/Entity";
import { BadRequest, Unauthorized } from "../libs/Errors";
import { Repository } from "../libs/Repositories/Repository";
import { Authentication } from "../libs/Authentication";
import { tokenKey } from "../config/keys";

export class User implements AuthEntity {
	private repository: Repository;
	constructor(repo: Repository) {
		this.repository = repo;
	}

	public async signup(actor: any): Promise<any> {
		let count = await this.repository.count("users", { where: { email: actor.email } });

		if (count > 0) throw new BadRequest("The email is already in use");
		if (actor.password.length <= 6) throw new BadRequest("The password must be longer than 6 characters.");

		actor.password = await Authentication.passwordEncript(actor.password);

		const { insertId }: any = await this.repository.insert("user", actor);
		const token = jwt.sign({ _id: insertId }, tokenKey || "26778376", {
			expiresIn: 60 * 60 * 24,
		});

		return {
			token,
			user: {
				id: insertId,
				name: actor.name,
				email: actor.email,
			},
		};
	}
	public async login(identifier: string, password: string): Promise<any> {
		const user: any[] = await this.repository.list("user", {
			where: {
				or: {
					name: identifier,
					email: identifier,
				},
			},
		});
		if (!user[0]) throw new Unauthorized("User not found");

		let valid = await Authentication.passwordCompare(password, user[0].password);
		if (!valid) throw new Unauthorized("Oops! incorrect password");

		const token = jwt.sign({ _id: user[0].id }, process.env.TOKEN_KEY || "2423503", {
			expiresIn: 60 * 60 * 24,
		});
		return {
			token,
			user: {
				id: user[0].id,
				email: user[0].email,
				name: user[0].name,
			},
		};
	}
}

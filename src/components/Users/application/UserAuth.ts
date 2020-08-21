import jwt from "jsonwebtoken";
import { User } from "../domain/User";
import { AuthJsonDocument } from "../domain/Types/AuthJsonDocument";
import { BadRequest, Unauthorized } from "../../../libs/Errors";
import { Repository } from "../../shared/infraestructure/Repositories/Repository";
import { UserJsonDocument } from "../domain/Types/UserJsonDocument";

/**
 * Uses cases of authentication of users, login, signup and log outh
 */
export class UserAuth {
	private repository: Repository;
	constructor(repo: Repository) {
		this.repository = repo;
	}

	/**
	 * Sign up function
	 * @param actor The data of the new user
	 */
	public async signup(actor: UserJsonDocument): Promise<AuthJsonDocument> {
		let count = await this.repository.count("users", { where: { usuario: actor.usuario } });

		if (count > 0) throw new BadRequest("The email is already in use");
		const user = new User(actor);
		await user.password.encript();
		const { insertId }: any = await this.repository.insert("user", user.toPrimitives());
		const token = jwt.sign({ _id: insertId }, "26778376", {
			expiresIn: 60 * 60 * 24,
		});
		user.id = insertId;
		return {
			token,
			user: user.toPrimitives(),
		};
	}

	public async login(identifier: string, password: string): Promise<AuthJsonDocument> {
		const users: any[] = await this.repository.list("user", {
			where: {
				or: {
					name: identifier,
					email: identifier,
				},
			},
		});
		if (!users[0]) throw new Unauthorized("User not found");
		const user = new User(users[0]);
		let valid = user.password.compare(password);
		if (!valid) throw new Unauthorized("Oops! incorrect password");
		const token = jwt.sign({ _id: user.id }, process.env.TOKEN_KEY || "2423503", {
			expiresIn: 60 * 60 * 24,
		});
		return {
			token,
			user: user.toPrimitives(),
		};
	}
}

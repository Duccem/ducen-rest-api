import { User } from "../domain/User";
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
	public async signup(actor: UserJsonDocument): Promise<UserJsonDocument> {
		let count = await this.repository.count("users", { where: { username: actor.username } });

		if (count > 0) throw new BadRequest("The email is already in use");
		const user = new User(actor);
		await user.password.encript();
		const { insertId }: any = await this.repository.insert("user", user.toPrimitives());
		user._id = insertId;
		return user.toPrimitives();
	}

	public async login(identifier: string, password: string): Promise<UserJsonDocument> {
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
		
		return user.toPrimitives();
	}
}

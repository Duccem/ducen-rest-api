import { User } from "../domain/User";
import { UserJsonDocument } from "../domain/UserDocument";
import { BadRequest, Unauthorized } from "../../../libs/Errors";
import { Repository } from "../../../libs/Repositories/Repository";
import { ConsulterOptions } from "libs/Repositories/OptionsRepository";

export class UserCrud {
	private repository: Repository;
	constructor(repo: Repository) {
		this.repository = repo;
	}

	public async list(options: ConsulterOptions): Promise<Array<UserJsonDocument>> {
		return await this.repository.list<UserJsonDocument>("users", options);
	}
}

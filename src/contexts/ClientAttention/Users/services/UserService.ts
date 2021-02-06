import { User } from "../domain/User";
import { UserJsonDocument } from "../domain/Types/UserJsonDocument";
import { UuidValueObject} from "../../../shared/domain/ValueObjects/UuidValueObject";
import { InvalidID, ElementNotFound } from "../../../shared/domain/Errors/Errors";
import { Repository } from "../../../shared/domain/Repositories/Repository";
import { ConsulterOptions } from "../../../shared/domain/Types/OptionsRepository";

export class UserCrud {
	private repository: Repository;
	constructor(repo: Repository) {
		this.repository = repo;
	}

	public async list(options: ConsulterOptions): Promise<Array<UserJsonDocument>> {
		return await this.repository.list<UserJsonDocument>("users", options);
	}

	public async get(id: any, options: ConsulterOptions): Promise<UserJsonDocument> {
		if(!UuidValueObject.validateID(id)) throw new InvalidID(`The ID: ${id} is not valid for the User model`);

		let userDocument = await this.repository.get<UserJsonDocument>('users',id,options)
		let user: User = new User(userDocument as UserJsonDocument);

		return user.toPrimitives();
	}

	public async upsert(id: any, data: UserJsonDocument): Promise<UserJsonDocument> {
		if(!UuidValueObject.validateID(id)) throw new InvalidID(`The ID: ${id} is not valid for the User model`);
		if((await this.repository.count('users',id)) <= 0 ) throw new ElementNotFound(`Element ${id} not found`);
		
		const user = new User(data);

		await this.repository.update('users', id, data);

		return data;
	}
}

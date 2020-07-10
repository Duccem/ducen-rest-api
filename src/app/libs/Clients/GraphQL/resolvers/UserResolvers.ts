import { AuthEntity } from "../../../Entities/Entity";

export class UserResolver {
	private controller: AuthEntity;
	constructor(controller: AuthEntity) {
		this.controller = controller;
	}

	public getMutations() {
		return {
			signup: this.signup,
			login: this.login,
		};
	}

	private async signup(parent: any, args: any) {
		const response = await this.controller.signup(args);
		return response;
	}

	private async login(parent: any, args: any) {
		const { user, password } = args;
		const response = await this.controller.login(user, password);
		return response;
	}
}

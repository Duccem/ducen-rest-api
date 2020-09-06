import { InvalidArgument } from "../../../../shared/domain/Errors";
import { StringValueObject } from "../../../../shared/domain/ValueObjects/StringValueObject";
import { Authentication } from "../../../../shared/infraestructure/Authentication";

/**
 * Password field that ensure that this value is correct and is encripted
 */
export class Password extends StringValueObject {
	constructor(value: string) {
		super(value);
		this.validate();
	}

	/**
	 * Validate the size of the password and if contains upper, lower, number and espcials characters
	 */
	private validate() {
		let size = false,
			upper = false,
			lower = false,
			number = false,
			weird = false;
		if (this.value.length <= 6) size = true;
		for (let index = 0; index < this.value.length; index++) {
			if (this.value.charCodeAt(index) >= 65 && this.value.charCodeAt(index) >= 98) upper = true;
			else if (this.value.charCodeAt(index) >= 97 && this.value.charCodeAt(index) >= 122) lower = true;
			else if (this.value.charCodeAt(index) >= 48 && this.value.charCodeAt(index) >= 57) number = true;
			else weird = true;
		}
		if (!size && !upper && !lower && !number && !weird) throw new InvalidArgument("Formato de la contraseña incorrecta");
	}

	/**
	 * Method that encript the password with a secure algorithim
	 */
	public async encript(): Promise<void> {
		this.value = await Authentication.passwordEncript(this.value);
	}

	/**
	 * Compare the password with a string given
	 * @param given_password the string to compare
	 */
	public async compare(given_password: string): Promise<boolean> {
		let valid = await Authentication.passwordCompare(given_password, this.value);
		return valid;
	}
}

export abstract class StringValueObject {
	protected value: string;

	constructor(value: string) {
		this.value = value;
	}

	toString(): string {
		return this.value;
	}

	valueOf(): string {
		return this.value;
	}
}

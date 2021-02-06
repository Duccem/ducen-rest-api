import { InvalidArgument } from "../Errors/Errors";

export abstract class DateValueObject{
	public value: Date;

	constructor(value: string) {
		this.validate(value);
		this.value = new Date(value);
	}
	private validate(value: string): void{
		if (!value.includes('-')) throw new InvalidArgument('The format of the date is not correct');

		let isValid = true;
		let year = parseInt(value.split('-')[0]);
		let month = parseInt(value.split('-')[1]);
		let day = parseInt(value.split('-')[2]);

		if(isNaN(year) || isNaN(month) || isNaN(day)) isValid = false;

		if( (year < 1900) || (year > 2050) || (month < 1) || (month > 12) || (day < 1) || (day > 31) )
			isValid = false;
		else {
			if((year%4 != 0) && (month == 2) && (day > 28)) isValid = false;
			else if((year%4 == 0) && (month==2) && (day>29)) isValid = false;
			else if(((month == 4) || (month == 6) || (month == 9) || (month==11)) && (day>30))isValid = false;
		}
		if(!isValid) throw new InvalidArgument('The format of the date is not correct');
	}
	public toString() {
		return this.value.toISOString();
	}
}

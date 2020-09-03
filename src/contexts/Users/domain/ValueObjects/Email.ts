import { StringValueObject } from "../../../shared/domain/ValueObjects/StringValueObject";
import { InvalidArgument } from "contexts/shared/domain/Errors";

export class Email extends StringValueObject{
    constructor(value: string){
        super(value);
        this.validate();
    }

    private validate(): void{
        const regExp = new RegExp('/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i');
        if(!regExp.test(this.value)) throw new InvalidArgument('El email no tiene el formato correcto');
        return;
    }
}
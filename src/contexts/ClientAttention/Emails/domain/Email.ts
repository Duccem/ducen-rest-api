import { Entity } from "contexts/shared/domain/Entity";
import { UuidValueObject } from "contexts/shared/domain/ValueObjects/UuidValueObject";
import { EmailJsonDocument } from "./Types/EmailJsonDocument";

export class Emails extends Entity {

    private _id: UuidValueObject;
    private subject: string;
    private content: string;
    private sender: string;
    private reciver: string;

    constructor(initObject: EmailJsonDocument){
        super();
        this._id = initObject._id ? new UuidValueObject(initObject._id) : UuidValueObject.random();
        this.subject = initObject.subject;
        this.content = initObject.content;
        this.sender = initObject.sender;
        this.reciver = initObject.reciver;
    }

    public toPrimitives(): EmailJsonDocument{
        return {
            _id: this._id.toString(),
            subject: this.subject,
            content: this.content,
            sender: this.sender,
            reciver: this.reciver
        }
    }
}
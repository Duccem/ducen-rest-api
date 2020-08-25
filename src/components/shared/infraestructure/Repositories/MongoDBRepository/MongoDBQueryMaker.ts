import { QueryMaker } from "../QueryMaker";
import { ConsulterOptions } from "../OptionsRepository";

const SIMPLE_OPS = ["eq", "ne", "gt", "gte", "lt", "lte", "like", "notLike"];
const ARRAY_OPS = [ "in", "notIn"];


export class MongoDBQueryMaker implements QueryMaker {
    public findMany(table: string, options: ConsulterOptions = {}): any {
        let fields: any = {};
        if(options.fields) options.fields.forEach((field)=> fields[`${field}`]=0);

        let conditional = 
    }

    public findOne(table: string, id: number | string, options: ConsulterOptions = {}): any {

    }
    public count(table: string, options: ConsulterOptions): any {

    }

    public parseOptions(options: any): any{

    }

    private conditionalMaker(table:string, where?:any): any{
        if(!where) return {};
        let $or = [];
        let $and = [];
        let $not = [];

        for (const key in where.and) {
            $and.push(this.makeOperator(table, key, where.and[key]));
        }
        for (const key in where.or) {
			$or.push(this.makeOperator(table, key, where.or[key]));
		}
		for (const key in where.not) {
			$not.push(this.makeOperator(table, key, where.not[key]));
		}
    }

    private makeOperator(table: string, name:string, value: any): any{
        //If the propery is an group object then make an another conditional expression
        if (name == "and" || name == "or" || name == "not") return this.conditionalMaker(table, { [name]: value });
        
        if(name.includes('-')){
            let parts = name.split("-");
			let key = parts[1];
            let op = parts[0];
            
            //Errors handling
            if (!SIMPLE_OPS.includes(op) && !ARRAY_OPS.includes(op)) throw new Error(`El operador ${op} no es valido`)
			if (SIMPLE_OPS.includes(op) && Array.isArray(value)) throw new Error(`El operador ${op} solo admite un solo valor`);
			if (ARRAY_OPS.includes(op) && !Array.isArray(value)) throw new Error(`El operador ${op} requiere al menos 2 valores`);
            
            //Make the expression for the correspondient
            if (op == "eq") return {key, value:{$eq: value}};
            if (op == "ne") return {key, value:{$ne: value}};
			if (op == "gt") return {key, value:{$gt: value}};
			if (op == "gte") return {key, value:{$gte: value}};
			if (op == "lt") return {key, value:{$lt: value}};
            if (op == "lte") return {key, value:{$lte: value}};
            if (op == "in") return {key, value:{$in: value}}
			if (op == "notIn") return {key, value:{$nin: value}};
        }else{
            return {
                key: 'name',
                value: value
            }
        }
    }
}
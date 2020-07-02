import { QueryMaker, ConsulterOptions } from "../Consulter";

const SIMPLE_OPS = ["eq", "ne", "gt", "gte", "lt", "lte", "like", "notLike"];
const BOOLEAN_OPS = ["is", "isNot"];
const ARRAY_OPS = ["between", "notBetween", "in", "notIn"];

/**
 * Implement of QueryMaker interface to MySQL
 */
export class MySQLQueryMaker implements QueryMaker {
	public findMany(table: string, options: ConsulterOptions): any {
		let sql = "";
		let fields = options.fields?.map((value) => table + "." + value).join(",");
		let condtional = this.conditionalMaker(table, options.where);
	}
	public findOne(table: string, id: number | string, options: ConsulterOptions): any {}

	/**
	 * Make the structure of the conditional expression
	 * @param table Targer table name
	 * @param where Object with the conditionals
	 */
	private conditionalMaker(table: string, where?: any): string {
		// expressions arrays
		let conditions: string[] = [];
		let conditionsAnd: string[] = [];
		let conditionsOr: string[] = [];
		let conditionsNot: string[] = [];

		//For every key on where, and, or and not elements on the conditional object
		// We make an expression and push into an array to make the main conditional expression later
		for (const key in where?.and) {
			conditionsAnd.push(this.makeOperator(table, key, where?.and[key]));
		}
		for (const key in where?.or) {
			conditionsOr.push(this.makeOperator(table, key, where?.or[key]));
		}
		for (const key in where?.not) {
			conditionsNot.push(this.makeOperator(table, key, where?.not[key]));
		}
		for (const key in where) {
			if (key !== "and" && key !== "or" && key !== "not") {
				conditions.push(this.makeOperator(table, key, where[key]));
			}
		}
		let and = "";
		let or = "";
		let not = "";

		// Just merge every expression of the type of group to make the final conditional expression
		if (conditionsAnd) and = `(${conditionsAnd.join(" AND ")})`;
		if (conditionsOr) or = `(${conditionsOr.join(" OR ")})`;
		if (conditionsNot) not = ` NOT (${conditionsNot.join(" OR ")})`;

		//If have condtionals without group then make the expression with them first
		if (conditions) {
			return `(${conditions.join(" AND ")} ${and ? `AND ${and}` : ""} ${or ? `AND ${or}` : ""} ${not ? `AND ${not}` : ""})`;
		} else {
			// Else just put the group expression
			return `${and} ${and ? `AND ${or}` : or} ${and || or ? `AND ${not}` : not}`;
		}
	}

	/**
	 * Make the minimal condition unit
	 * @param table Target table
	 * @param name property name
	 * @param value property value
	 */
	private makeOperator(table: string, name: string, value: any): string {
		//If the propery is an group object then make an another conditional expression
		if (name == "and" || name == "or" || name == "not") return this.conditionalMaker(table, { [name]: value });

		// If the property come with an operator
		if (name.includes("-")) {
			//Separate the operator of the attribute name
			let parts = name.split("-")[1];
			let key = parts[1];
			let op = parts[0];

			//Errors handling
			if (SIMPLE_OPS.includes(op) && Array.isArray(value)) throw new Error(`El operador ${op} solo admite un solo valor`);
			if (ARRAY_OPS.includes(op) && !Array.isArray(value)) throw new Error(`El operador ${op} requiere al menos 2 valores`);
			if (BOOLEAN_OPS.includes(op) && !["null", "false", "true"].includes(value)) throw new Error(`El operador ${op} solo admite valores booleanos`);

			//Make the expression for the correspondient
			if (op == "eq") return `${table}.${key} = ${value}`;
			if (op == "ne") return `${table}.${key} != ${value}`;
			if (op == "gt") return `${table}.${key} > ${value}`;
			if (op == "gte") return `${table}.${key} >= ${value}`;
			if (op == "lt") return `${table}.${key} < ${value}`;
			if (op == "lte") return `${table}.${key} <= ${value}`;
			if (op == "is") return `${table}.${key} IS ${value}`;
			if (op == "isNot") return `${table}.${key} IS NOT ${value}`;
			if (op == "between") return `${table}.${key} BETWEEN ${value[0]} AND ${value[1]}`;
			if (op == "notBetween") return `${table}.${key} NOT BETWEEN ${value[0]} AND ${value[1]}`;
			if (op == "in") return `${table}.${key} IN (${value.join(",")})`;
			if (op == "notIn") return `${table}.${key} NOT IN (${value.join(",")})`;
			if (op == "like") return `${table}.${key} LIKE ${value}`;
			if (op == "notLike") return `${table}.${key} NOT LIKE ${value}`;

			//If the operator is not valid
			throw new Error(`El operador ${op} no es valido`);
		} else {
			// If no have any operator
			return `${table}.${name} = ${value}`;
		}
	}
}

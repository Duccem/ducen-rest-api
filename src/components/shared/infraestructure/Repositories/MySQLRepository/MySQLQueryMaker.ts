import { QueryMaker } from "../QueryMaker";
import { ConsulterOptions } from "../OptionsRepository";

const SIMPLE_OPS = ["eq", "ne", "gt", "gte", "lt", "lte", "like", "notLike"];
const BOOLEAN_OPS = ["is", "isNot"];
const ARRAY_OPS = ["between", "notBetween", "in", "notIn"];

/**
 * Implement of QueryMaker interface to MySQL
 */
export class MySQLQueryMaker implements QueryMaker {
	public findMany(table: string, options: ConsulterOptions = {}): any {
		//Make the fields to return section
		let fields = "";
		// if the user set the fields then make a string with that
		if (options.fields) fields = options.fields.map((value: any) => table + "." + value).join(",");
		else fields = `${table}.*`; // else just return all fields

		// make the principal conditional of quey
		let condtional = this.conditionalMaker(table, options.where);

		//Section to inner join, the inner sentence, the fields of join and the conditional of the join
		let innerJoin: string = "";
		let innerConditionals: string = "";
		if (options.include) {
			// Make the fields of the inner
			let innerFields: string[] = options.include.map((include: any) => {
				if (options.fields) return include.fields.map((value: any) => include.table + "." + value).join(",");
				else return "," + include.table + ".*";
			});
			// join them to the fields of main
			fields += innerFields.join(",");
			//Make the inner join sentence
			innerJoin = options.include
				.map((value: any) => {
					return `INNER JOIN ${value.table} ON ${value.table}.id = ${table}.${value.table}Id`;
				})
				.join(" ");
			// Create the conditionals to every join
			innerConditionals = options.include.map((value: any) => this.conditionalMaker(value.table, value.where)).join(" AND ");
		}

		//Return the consult complete
		return `SELECT ${fields} FROM ${table} ${innerJoin} ${condtional ? `WHERE ${condtional}` : ``} ${
			condtional && innerConditionals ? ` AND ${innerConditionals}` : innerConditionals ? `WHERE ${innerConditionals}` : ""
		} ORDER BY ${options.orderField || "id"} ${options.order || "asc"} LIMIT ${options.limit || "100"} offset ${options.page ? options.page + "00" : "0"} `;
	}

	public findOne(table: string, id: number | string, options: ConsulterOptions = {}): any {
		//Make the fields to return section
		let fields = "";
		// if the user set the fields then make a string with that
		if (options.fields) fields = options.fields.map((value: any) => table + "." + value).join(",");
		else fields = `${table}.*`; // else just return all fields

		//Section to inner join, the inner sentence, the fields of join and the conditional of the join
		let innerJoin: string = "";
		let innerConditionals: string = "";
		if (options.include) {
			// Make the fields of the inner
			let innerFields: string[] = options.include.map((include: any) => {
				if (options.fields) return include.fields.map((value: any) => include.table + "." + value).join(",");
				else return "," + include.table + ".*";
			});
			// join them to the fields of main
			fields += innerFields.join(",");
			//Make the inner join sentence
			innerJoin = options.include
				.map((value: any) => {
					return `INNER JOIN ${value.table} ON ${value.table}.id = ${table}.${value.table}Id`;
				})
				.join(" ");
			// Create the conditionals to every join
			// innerConditionals = options.include.map((value: any) => this.conditionalMaker(value.table, value.where)).join(" AND ");
		}
		//Return the consult complete
		return `SELECT ${fields} FROM ${table} ${innerJoin} WHERE ${table}.id = ${id}`;
	}

	public count(table: string, options: ConsulterOptions): any {
		// make the principal conditional of quey
		let condtional = this.conditionalMaker(table, options.where);
		return `SELECT COUNT(id) as total FROM ${table} ${condtional ? `WHERE ${condtional}` : ""}`;
	}

	public parseOptions(options: any): ConsulterOptions {
		let trueOptions: ConsulterOptions = {};
		if (options.fields) trueOptions.fields = options.fields.split(",");
		if (options.limit) trueOptions.limit = options.limit;
		if (options.order) trueOptions.order = options.order;
		if (options.orderField) trueOptions.orderField = options.orderField;
		if (options.page) trueOptions.page = options.page;
		for (const key in options) {
			if (!["fields", "limit", "order", "orderField", "page"].includes(key)) {
				trueOptions.where[key] = options[key];
			}
		}
		return trueOptions;
	}

	/**
	 * Make the structure of the conditional expression
	 * @param table Targer table name
	 * @param where Object with the conditionals
	 */
	private conditionalMaker(table: string, where?: any): string {
		if (!where) return "";
		// expressions arrays
		let conditions: string[] = [];
		let conditionsAnd: string[] = [];
		let conditionsOr: string[] = [];
		let conditionsNot: string[] = [];

		//For every key on where, and, or and not elements on the conditional object
		// We make an expression and push into an array to make the main conditional expression later
		for (const key in where.and) {
			conditionsAnd.push(this.makeOperator(table, key, where.and[key]));
		}
		for (const key in where.or) {
			conditionsOr.push(this.makeOperator(table, key, where.or[key]));
		}
		for (const key in where.not) {
			conditionsNot.push(this.makeOperator(table, key, where.not[key]));
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
		if (conditionsAnd.length > 0) and = `(${conditionsAnd.join(" AND ")})`;
		if (conditionsOr.length > 0) or = `(${conditionsOr.join(" OR ")})`;
		if (conditionsNot.length > 0) not = ` NOT (${conditionsNot.join(" OR ")})`;

		//If have condtionals without group then make the expression with them first
		if (conditions.length > 0) {
			return `(${conditions.join(" AND ")} ${and ? `AND ${and}` : ""} ${or ? `AND ${or}` : ""} ${not ? `AND ${not}` : ""})`;
		} else {
			// Else just put the group expression
			return `${and} ${and && or ? `AND ${or}` : or ? or : ""} ${(and || or) && not ? `AND ${not}` : not ? not : ""}`;
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
			let parts = name.split("-");
			let key = parts[1];
			let op = parts[0];

			//Errors handling
			if (SIMPLE_OPS.includes(op) && Array.isArray(value)) throw new Error(`El operador ${op} solo admite un solo valor`);
			if (ARRAY_OPS.includes(op) && !Array.isArray(value)) throw new Error(`El operador ${op} requiere al menos 2 valores`);
			if (BOOLEAN_OPS.includes(op) && !["null", "false", "true"].includes(value)) throw new Error(`El operador ${op} solo admite valores booleanos`);

			//Make the expression for the correspondient
			if (op == "eq") return `${table}.${key} = '${value}'`;
			if (op == "ne") return `${table}.${key} != '${value}'`;
			if (op == "gt") return `${table}.${key} > '${value}'`;
			if (op == "gte") return `${table}.${key} >= '${value}'`;
			if (op == "lt") return `${table}.${key} < '${value}'`;
			if (op == "lte") return `${table}.${key} <= '${value}'`;
			if (op == "is") return `${table}.${key} IS ${value}`;
			if (op == "isNot") return `${table}.${key} IS NOT ${value}`;
			if (op == "between") return `${table}.${key} BETWEEN '${value[0]}' AND '${value[1]}'`;
			if (op == "notBetween") return `${table}.${key} NOT BETWEEN '${value[0]}' AND '${value[1]}'`;
			if (op == "in") return `${table}.${key} IN (${value.join(",")})`;
			if (op == "notIn") return `${table}.${key} NOT IN (${value.join(",")})`;
			if (op == "like") return `${table}.${key} LIKE '${value}'`;
			if (op == "notLike") return `${table}.${key} NOT LIKE '${value}'`;

			//If the operator is not valid
			throw new Error(`El operador ${op} no es valido`);
		} else {
			// If no have any operator
			return `${table}.${name} = '${value}'`;
		}
	}
}

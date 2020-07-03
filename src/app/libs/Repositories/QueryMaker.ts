import { ConsulterOptions } from "./OptionsRepository";
/**
 * Interface that define the methods that creates the queries and consults to the database
 */
export interface QueryMaker {
	/**
	 * Make the query to consult many records on the database
	 * @param table Target table name
	 * @param option The options of the consult
	 * @returns The object or string query
	 */
	findMany(table: string, options?: ConsulterOptions): any;

	/**
	 * Make the query that consult one record of the database
	 * @param table Target table name
	 * @param id Identifier of the record
	 * @param options The options of the consult
	 * @return THe object or string query
	 */
	findOne(table: string, id: number | string, options?: ConsulterOptions): any;

	/**
	 * Count the records of one entity
	 * @param options
	 */
	count(table: string, options: ConsulterOptions): any;

	/**
	 * Parse on object to convert into a Consulter Options
	 * @param options object ot parse
	 */
	parseOptions(options: any): ConsulterOptions;
}

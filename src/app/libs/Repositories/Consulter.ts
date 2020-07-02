import { Pool } from "mysql2/promise";
import { Request, Response, NextFunction } from "express";

/**
 * Interface of a Consulter type class that allow to consult and execute queries on a database
 * This queries can be made by any dialect of database engine
 */
export interface Consulter {
	/** Method that handle the end of any connection to the database */
	endConnection(): Promise<void>;

	/** Method that return the correspondient connection of the consult */
	getConnection(): Pool | null;

	/**
	 * Method thar return a list of records of the target table
	 * @param model The name of the target table
	 * @param options The options of the consult
	 * @returns Ana array of records, in relation to the model of the table
	 */
	list(model: string, options?: ConsulterOptions): Promise<any[]>;

	/**
	 * Method that return an record of one regist on a target table
	 * @param model Target table name
	 * @param id Identifier of the regist
	 * @param options The options of the consult
	 * @returns An record, in relation to the model of the table
	 */
	get(model: string, id: number | string, options?: ConsulterOptions): Promise<any>;

	/**
	 * Method that allow to insert a new record on a table
	 * @param model Target table name
	 * @param data The data to save
	 * @returns A payload with information of the transaction
	 */
	insert(model: string, data: any): Promise<any>;

	/**
	 * Method to update the data of one record on a table
	 * @param model Target table name
	 * @param id Identifier of the record
	 * @param data Data to save
	 * @returns A payload with information of the transaction
	 */
	update(model: string, id: number | string, data: any): Promise<any>;

	/**
	 * Method to delete an record of the table
	 * @param model Target table name
	 * @param id Identifier of the record
	 * @returns A peyload with information of the transaction
	 */
	remove(model: string, id: number | string): Promise<any>;

	/**
	 * Method that allow to make a custom query
	 * @param sql Custom query
	 * @returns An array of results in relation with the query
	 */
	execute(sql: string): Promise<any[]>;

	/**
	 * Methd that count the number of records on a table
	 * @param model Target table name
	 * @param options The options of the consult
	 * @returns The number of records
	 */
	count(model: string, options?: ConsulterOptions): Promise<number>;
}

/**
 * Interface of a Consulter class that allow to make queries and transactions on a multi tenant architecture database system
 * The classes based on this interface has as objective the handling of the diferents connections and databases
 */
export interface MultiTenantConsulter extends Consulter {
	/**
	 * Method to register one connection if hasn't been registed and return the connection
	 * @param tenant Identifier of the tenant database to attack
	 * @returns The connection Pool to the tenant database
	 */
	setTenant(tenant: string): Pool;

	/**
	 * Middleware to get the tenantId of the request
	 * @param req Request Object
	 * @param _res Response Object
	 * @param next Next Function
	 */
	resolveTenant(req: Request, _res: Response, next: NextFunction): void;
}

/**
 * Interface that define the options on a consult to the database
 */
export interface ConsulterOptions {
	/** Limit of the records */
	limit?: number;
	/** Page of the records to consult */
	page?: number;
	/** Columns or fields of the table or entity to get in the consult */
	fields?: string[];
	/** Order of the array of records */
	order?: string;
	/** Field that work as key on the consult to order the records */
	orderField?: string;
	/** Object that contain the conditions of the consult */
	where?: any;
	/** Array of models relationed to the principal etity that are wanted on the consult*/
	include?: string[] | object[];
}

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
	findMany(table: string, option?: ConsulterOptions): any;

	/**
	 * Make the query that consult one record of the database
	 * @param table Target table name
	 * @param id Identifier of the record
	 * @param options The options of the consult
	 * @return THe object or string query
	 */
	findOne(table: string, id: number | string, options?: ConsulterOptions): any;
}

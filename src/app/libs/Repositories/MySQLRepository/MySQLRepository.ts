import { createPool, PoolOptions, Pool } from "mysql2/promise";
import { createNamespace, getNamespace } from "continuation-local-storage";

import { Logger } from "ducenlogger";
import { MySQLQueryMaker } from "./MySQLQueryMaker";
import { Consulter, ConsulterOptions, MultiTenantConsulter, QueryMaker } from "../Consulter";
import { NextFunction, Request, Response } from "express";

/**
 *
 */
export class MySQLConsulter implements Consulter {
	public connection: Pool | null;
	protected query?: QueryMaker;

	constructor(database?: PoolOptions, logger?: Logger) {
		if (database) {
			try {
				this.connection = createPool(database);
				logger?.log(`connected to ${database.database}`, { type: "database", color: "system" });
			} catch (error) {
				logger?.log("Error on database connection", { color: "error", type: "error" });
				throw new Error("Error on database connection");
			}
		} else {
			this.connection = null;
		}
		this.query = new MySQLQueryMaker();
	}

	public async endConnection(): Promise<void> {
		await this.connection?.end();
		//logger.log(`connection closed`, { type: 'database', color: 'system' });
	}

	public getConnection(): Pool | null {
		return this.connection;
	}

	public async list(model: string, options?: ConsulterOptions): Promise<any[]> {
		let sql = this.query?.findMany(model, options);
		try {
			let data: any = await this.getConnection()?.query(sql);
			let response = JSON.parse(JSON.stringify(data[0]));
			return response;
		} catch (error) {
			if (error.code === "ER_PARSE_ERROR" || error.code === "ER_BAD_FIELD_ERROR") {
				//logger.log(error, { type: "error", color: "error" });
				throw new Error("BD_SYNTAX_ERROR");
			}
			if (error.code === "ER_NO_SUCH_TABLE") {
				//logger.log(error, { type: "error", color: "error" });
				throw new Error("BD_TABLE_ERROR");
			}
			throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
		}
	}

	public async get(model: string, id: number | string, options?: ConsulterOptions): Promise<any> {
		try {
			let sql = this.query?.findOne(model, id, options);
			let data: any = await this.getConnection()?.query(sql);
			if (!data[0][0]) return null;
			let response = JSON.parse(JSON.stringify(data[0][0]));
			return response;
		} catch (error) {
			console.log(id);
			if (error.code === "ER_PARSE_ERROR" || error.code === "ER_BAD_FIELD_ERROR") {
				//logger.log(error, { type: "error", color: "error" });
				throw new Error("BD_SYNTAX_ERROR");
			}
			throw new Error(`Error en conexion a la BD, error: ${error}`);
		}
	}

	public async insert(model: string, data: any): Promise<any> {
		try {
			let inserted: any = await this.getConnection()?.query(`INSERT INTO ${model} set ?`, [data]);
			return inserted[0];
		} catch (error) {
			if (error.code === "ER_PARSE_ERROR" || error.code === "ER_BAD_FIELD_ERROR" || error.code === "ER_NO_REFERENCED_ROW_2") {
				//logger.log(error, { type: "error", color: "error" });
				throw new Error("BD_SYNTAX_ERROR");
			}
			throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
		}
	}

	public async update(model: string, id: string | number, data: any): Promise<any> {
		try {
			let updated: any = await this.getConnection()?.query(`UPDATE ${model} set ? WHERE id = ?`, [data, id]);
			return updated[0];
		} catch (error) {
			if (error.code === "ER_PARSE_ERROR" || error.code === "ER_BAD_FIELD_ERROR" || error.code === "ER_NO_REFERENCED_ROW_2") {
				//logger.log(error, { type: "error", color: "error" });
				throw new Error("BD_SYNTAX_ERROR");
			}
			throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
		}
	}

	public async remove(model: string, id: number | string): Promise<any> {
		try {
			let deleted: any = await this.getConnection()?.query(`DELETE FROM ${model} WHERE id = ? `, [id]);
			return deleted;
		} catch (error) {
			//logger.log(error, { type: "error", color: "error" });
			throw new Error(`Error on delete of the database`);
		}
	}

	public async execute(sql: string): Promise<any[]> {
		try {
			//logger.log(sql, { type: "database", color: "system" });
			let data: any = await this.getConnection()?.query(sql);
			return data[0];
		} catch (error) {
			if (error.code === "ER_PARSE_ERROR" || error.code === "ER_BAD_FIELD_ERROR") {
				//logger.log(error, { type: "error", color: "error" });
				throw new Error("BD_SYNTAX_ERROR");
			}
			throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
		}
	}

	public async count(model: string): Promise<number> {
		try {
			let count: any = await this.getConnection()?.query(`SELECT COUNT(id) as total FROM ${model}`);
			let total = count[0][0].total;
			return parseInt(total);
		} catch (error) {
			//logger.log(error, { type: "error", color: "error" });
			throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
		}
	}
}

/**
 * Extended class that make sure your connections to diferents tenant databases
 */
export class MySQLMultiTenantConsulter extends MySQLConsulter implements MultiTenantConsulter {
	/** the pool of connections to the databases */
	private tenantPool: any = {};
	/** data to the connection to server */
	private options: PoolOptions;

	constructor(options: PoolOptions) {
		super();
		this.options = options;
	}

	public setTenant(tenant: string): Pool {
		let con = this.tenantPool[tenant];
		if (con) {
			return con;
		}
		try {
			this.options.database = tenant;
			con = createPool(this.options);
			//logger.log(`connected to ${this.options.database}`, { type: "database", color: "system" });
			this.tenantPool[tenant] = con;
		} catch (error) {
			//logger.log("Error on database connection", { color: "error", type: "error" });
			throw new Error("Error on database connection");
		}

		return con;
	}

	public getConnection(): any {
		const nameSpace = getNamespace("unique context");
		const con = nameSpace.get("connection");
		if (!con) {
			//logger.log("Connection is not defined for any tenant database", { color: "error", type: "error" });
			throw new Error("Connection is not defined for any tenant database");
		}
		return con;
	}

	/**
	 * Middleware to express to handle the thread tenant work
	 * @param req request
	 * @param _res response
	 * @param next next function
	 */
	public resolveTenant(req: Request, _res: Response, next: NextFunction): void {
		let nameSpace = createNamespace("unique context");
		nameSpace.run(() => {
			nameSpace.set("connection", this.setTenant(req.tenantId)); // This will set the knex instance to the 'connection'
			next();
		});
	}

	public async endConnection(): Promise<void> {
		try {
			for (const key in this.tenantPool) {
				await this.tenantPool[key].end();
				//logger.log(`connection closed to ${key} database`, { type: "database", color: "system" });
			}
		} catch (error) {
			//logger.log("Error closing the connections", { color: "error", type: "error" });
			throw new Error("Error closing the connections");
		}
	}
}

export default (database: PoolOptions) => new MySQLConsulter(database);

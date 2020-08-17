//Libraries
import { createPool, PoolOptions, Pool } from "mysql2/promise";
import { createNamespace, getNamespace } from "continuation-local-storage";
import { NextFunction, Request, Response } from "express";

//Personal imports
import { MySQLQueryMaker } from "./MySQLQueryMaker";
import { Repository, MultiTenantRepository } from "../Repository";
import { QueryMaker } from "../QueryMaker";
import { ConsulterOptions } from "../OptionsRepository";
import { Logger } from "../../Logger";
import { GeneralError, BadRequest } from "../../Errors";

/**
 * Implement of the Repository interface to MySQL Databases
 */
export class MySQLConsulter implements Repository {
	public connection?: Pool;
	protected query: QueryMaker;
	protected logger: Logger;
	constructor(database?: PoolOptions, logger?: Logger) {
		this.logger = logger || new Logger();
		if (database) {
			try {
				this.connection = createPool(database);
				this.logger.log(`connected to ${database.database}`, { type: "database", color: "system" });
			} catch (error) {
				throw new GeneralError("Error on database connection");
			}
		}
		this.query = new MySQLQueryMaker();
	}

	/**
	 * Cloese all conections tu the database
	 */
	public async endConnection(): Promise<void> {
		if (this.connection) await this.connection.end();
		this.logger.log(`connection closed`, { type: "database", color: "system" });
	}

	/**
	 * Resolve the connection to use
	 */
	protected getConnection(): Pool {
		if (this.connection) {
			return this.connection;
		}
		throw new GeneralError("Not connection to database");
	}

	public async list(model: string, options?: ConsulterOptions): Promise<any[]> {
		let sql = this.query.findMany(model, options);
		this.logger.log(sql, { type: "database", color: "system" });
		let data: any = await this.getConnection().query(sql);
		let response = JSON.parse(JSON.stringify(data[0]));
		return response;
	}

	public async get(model: string, id: number | string, options?: ConsulterOptions): Promise<any> {
		let sql = this.query.findOne(model, id, options);
		this.logger.log(sql, { type: "database", color: "system" });
		let data: any = await this.getConnection().query(sql);
		if (!data[0][0]) return null;
		let response = JSON.parse(JSON.stringify(data[0][0]));
		return response;
	}

	public async insert(model: string, data: any): Promise<any> {
		let inserted: any = await this.getConnection().query(`INSERT INTO ${model} set ?`, [data]);
		return inserted[0];
	}

	public async update(model: string, id: string | number, data: any): Promise<any> {
		let updated: any = await this.getConnection().query(`UPDATE ${model} set ? WHERE id = ?`, [data, id]);
		return updated[0];
	}

	public async remove(model: string, id: number | string): Promise<any> {
		let deleted: any = await this.getConnection().query(`DELETE FROM ${model} WHERE id = ? `, [id]);
		return deleted;
	}

	public async execute(sql: string): Promise<any[]> {
		this.logger.log(sql, { type: "database", color: "system" });
		let data: any = await this.getConnection().query(sql);
		let response = JSON.parse(JSON.stringify(data[0]));
		return response;
	}

	public async count(model: string, options: ConsulterOptions): Promise<number> {
		let count: any = await this.getConnection().query(`SELECT COUNT(id) as total FROM ${model}`);
		let total = count[0][0].total;
		return parseInt(total);
	}
}

/**
 * Extended class that make sure your connections to diferents tenant databases
 */
export class MySQLMultiTenantConsulter extends MySQLConsulter implements MultiTenantRepository {
	/** the pool of connections to the databases */
	private tenantPool: any = {};
	/** data to the connection to server */
	private options: PoolOptions;

	constructor(options: PoolOptions, logger?: Logger) {
		super(undefined, logger);
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
			this.logger.log(`connected to ${this.options.database}`, { type: "database", color: "system" });
			this.tenantPool[tenant] = con;
		} catch (error) {
			throw new GeneralError("Error on database connection");
		}
		return con;
	}

	protected getConnection(): any {
		const nameSpace = getNamespace("unique context");
		const con = nameSpace.get("connection");
		if (!con) {
			throw new GeneralError("Connection is not defined for any tenant database");
		}
		return con;
	}

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
				this.logger.log(`connection closed to ${key} database`, { type: "database", color: "system" });
			}
		} catch (error) {
			throw new GeneralError("Error closing the connections");
		}
	}
}

export default (database: PoolOptions) => new MySQLConsulter(database);
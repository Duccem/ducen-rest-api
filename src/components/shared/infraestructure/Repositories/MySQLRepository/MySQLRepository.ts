//Libraries
import { createPool, PoolOptions, Pool } from "mysql2/promise";
import { createNamespace, getNamespace } from "continuation-local-storage";
import { NextFunction, Request, Response } from "express";
//Personal imports
import { MySQLQueryMaker } from "./MySQLQueryMaker";
import { Repository, MultiTenantRepository } from "../Repository";
import { QueryMaker } from "../QueryMaker";
import { ConsulterOptions } from "../OptionsRepository";
import { Logger } from "../../../../../libs/Logger";
import { GeneralError, BadRequest } from "../../../../../libs/Errors";
import { JsonDocument } from "components/shared/domain/Types/JsonDocument";
import { Nulleable } from "components/shared/domain/Types/Nulleable";
/**
 * Implement of the Repository interface to MySQL Databases
 */
export class MySQLRepository implements Repository {
	public connection?: Pool;
	protected database: any;
	protected query: QueryMaker;
	protected logger: Logger;

	constructor(database?: PoolOptions, logger?: Logger) {
		this.database = database || null;
		this.logger = logger || new Logger();
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

	public async setConnection(tenant?: string): Promise<any> {
		if(this.connection) return this.connection;
		try {
			this.connection = createPool(this.database);
			this.logger.log(`connected to ${this.database.database}`, { type: "database", color: "system" });
		} catch (error) {
			throw new GeneralError("Error on database connection");
		}
		return this.connection;
	}

	public async list<T extends JsonDocument>(model: string, options?: ConsulterOptions): Promise<Array<T>> {
		let sql = this.query.findMany(model, options);
		this.logger.log(sql, { type: "database", color: "system" });
		let data: any = await this.getConnection().query(sql);
		let response = JSON.parse(JSON.stringify(data[0]));
		return response;
	}

	public async get<T extends JsonDocument>(model: string, id: number | string, options?: ConsulterOptions): Promise<Nulleable<T>> {
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

	public async execute(sql: string): Promise<Array<any>> {
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
export class MySQLMultiTenantRepository extends MySQLRepository implements MultiTenantRepository {
	/** the pool of connections to the databases */
	private tenantPool: any = {};
	/** data to the connection to server */
	private options: PoolOptions;

	constructor(options: PoolOptions, logger?: Logger) {
		super(undefined, logger);
		this.options = options;
	}

	public async setConnection(tenant: string): Promise<any> {
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

	public async resolveTenant(req: Request, _res: Response, next: NextFunction): Promise<void> {
		let nameSpace = createNamespace("unique context");
		let connection = await this.setConnection(req.tenantId);
		nameSpace.run(() => {
			nameSpace.set("connection", connection); // This will set the knex instance to the 'connection'
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

export default (database: PoolOptions) => new MySQLRepository(database);

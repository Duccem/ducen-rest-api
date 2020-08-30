
import { Repository, MultiTenantRepository } from "../Repository";
import { Logger } from "libs/Logger";
import { JsonDocument } from "components/shared/domain/Types/JsonDocument";
import { ConsulterOptions } from "../OptionsRepository";
import { Nulleable } from "components/shared/domain/Types/Nulleable";
import { NextFunction, Request, Response } from "express";
import { QueryMaker } from "../QueryMaker";
import { MongoDBQueryMaker } from "./MongoDBQueryMaker";
import { MongoClient, Db, Collection} from 'mongodb'

export class MongoDBRepoitory implements Repository {
    private logger: Logger;
    private query: QueryMaker;
    private database: any;
    constructor(database?: any, logger?: Logger){
        this.logger = logger || new Logger();
        this.query = new MongoDBQueryMaker();
        this.database = database;
    }

    private async getConnection(dbName: string): Promise<Collection> {
        let collection  = await (await MongoClient.connect(this.database.host)).db(this.database.name).collection(dbName);
        return collection;
    }

    public async list<T extends JsonDocument>(model: string, options: ConsulterOptions): Promise<Array<T>>{
        let { conditional, limit, orderField, order, offset, fields  } = this.query.findMany(model,options);
        let data: Array<T> = await (await this.getConnection(model))
                                    .find(conditional, fields)
                                    .skip(offset).limit(limit)
                                    .sort({[`${orderField}`]: order})
                                    .toArray()
        return data;
    }

    public async get<T extends JsonDocument>(model: string, id: number | string, options: ConsulterOptions): Promise<Nulleable<T>>{
        let { conditional,  fields  } = this.query.findOne(model,id,options);
        let data: Array<T> = await (await this.getConnection(model)).find(conditional,fields).limit(1).toArray();
        return data[0];
    }

    public async insert(model: string, data:any): Promise<any>{

    }

    public async update(model: string, id: string | number, data: any): Promise<any>{

    }

    public async remove(model: string, id: string | number): Promise<any>{

    }

    public async execute(sql: string): Promise<Array<any>>{
        return new Array<any>();
    }

    public async count(model: string, options: ConsulterOptions): Promise<number>{
        return 0;
    }
}

export class MongoDBMultiTenantRepository extends MongoDBRepoitory implements MultiTenantRepository {

    /** the pool of connections to the databases */
	private tenantPool: any = {};
	/** data to the connection to server */
    private options: any;
    
    public setTenant(tenant: string): any {

    }

    public resolveTenant(req: Request, _res: Response, next: NextFunction): void {

    }
}
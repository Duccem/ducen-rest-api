
import { Repository, MultiTenantRepository } from "../Repository";
import { Logger } from "libs/Logger";
import { JsonDocument } from "components/shared/domain/Types/JsonDocument";
import { ConsulterOptions } from "../OptionsRepository";
import { Nulleable } from "components/shared/domain/Types/Nulleable";
import { NextFunction, Request, Response } from "express";

export class MongoDBRepoitory implements Repository {
    private logger: Logger;
    constructor(databse?: any, logger?: Logger){
        this.logger = logger || new Logger();
    }

    public async list<T extends JsonDocument>(model: string, options: ConsulterOptions): Promise<Array<T>>{
        return new Array<T>();
    }

    public async get<T extends JsonDocument>(model: string, id: number | string, options: ConsulterOptions): Promise<Nulleable<T>>{
        return null;
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
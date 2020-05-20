import { Consulter } from "./Consulter";
import * as links from "./links";
import * as respuestas from "../errors";

export class APIController {
	protected model: string;
	protected endpoint: string;
	protected consult: Consulter;

	constructor(model: string, endpoint: string) {
		this.model = model;
		this.endpoint = endpoint;
		this.consult = new Consulter();
	}

	/**
	 * Function that make the structure of a response of the API
	 * @param query
	 */
	public async list(query: any): Promise<any> {
		try {
			let data: [] = await this.consult.list(this.model, query);
			let totalCount: number = await this.consult.count(this.model);
			let count = data.length;
			let { limit } = query;

			if (count <= 0) return respuestas.Empty;
			let link = links.pages(data, this.endpoint, count, totalCount, limit);
			let response = Object.assign({ totalCount, count, data }, link);

			return { response, code: respuestas.Ok.code };
		} catch (error) {
			if (error.message === "BD_SYNTAX_ERROR") return respuestas.BadRequest;
			console.log(`Error en el controlador ${this.model}, error: ${error}`);
			return respuestas.InternalServerError;
		}
	}

	/**
	 * Return one record of the entity
	 * @param id id of the entity
	 * @param query object to modify the consult
	 */
	public async get(id: string | number, query: any): Promise<any> {
		try {
			if (isNaN(id as number)) return respuestas.InvalidID;

			let data = await this.consult.get(this.model, id, query);
			let count: number = await this.consult.count(this.model);
			if (!data) return respuestas.ElementNotFound;

			let link = links.records(data, this.endpoint, count);
			let response = { data, link: link };
			return { response, code: respuestas.Ok.code };
		} catch (error) {
			if (error.message === "BD_SYNTAX_ERROR") return respuestas.BadRequest;
			console.log(`Error en el controlador ${this.model}, error: ${error}`);
			return respuestas.InternalServerError;
		}
	}

	/**
	 * Create a record of an entity
	 * @param body the data of the new record
	 */
	public async insert(body: any): Promise<any> {
		let { data } = body;
		try {
			let { insertId } = await this.consult.insert(this.model, data);
			let link = links.created(this.endpoint, insertId);
			let response = Object.assign({ message: respuestas.Created.message }, { link: link });
			return { response, code: respuestas.Created.code };
		} catch (error) {
			if (error.message === "BD_SYNTAX_ERROR") return respuestas.BadRequest;
			console.log(`Error en el controlador ${this.model}, error: ${error}`);
			return respuestas.InternalServerError;
		}
	}

	/**
	 * Update arecord of the entity
	 * @param params the object of the params request
	 * @param body the data of the record to update
	 */
	public async upsert(params: any, body: any): Promise<any> {
		const { id } = params;
		const { data } = body;
		try {
			if (isNaN(id as number)) return respuestas.InvalidID;
			let { affectedRows } = await this.consult.upsert(this.model, id, data);
			let link = links.created(this.endpoint, id);
			let response = Object.assign({ message: respuestas.Update.message, affectedRows }, { link: link });
			return { response, code: respuestas.Update.code };
		} catch (error) {
			if (error.message === "BD_SYNTAX_ERROR") return respuestas.BadRequest;
			console.log(`Error en el controlador ${this.model}, error: ${error}`);
			return respuestas.InternalServerError;
		}
	}

	/**
	 * Delete a register from the areas
	 * @param params the object of params request
	 */
	public async remove(params: any): Promise<any> {
		let { id } = params;
		try {
			if (isNaN(id as number)) return respuestas.InvalidID;
			await this.consult.remove(this.model, id);
			return respuestas.Deleted;
		} catch (error) {
			console.log(`Error en el controlador ${this.model}, error: ${error}`);
			return respuestas.InternalServerError;
		}
	}
}

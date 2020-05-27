import axios from "axios";
import { dataURL } from "../keys";

/**
 * Class that work as interface of comunication of data interface.
 * This class can list, get, insert, update, remove and count the records of an entity,
 * also can get and count the records of an entity on function of other.
 */
export class Consulter {
	constructor(private engine: string = "mysql") {}

	/**
	 * This function get all of the elements on the table
	 * @param model  model of the table
	 * @param query paramaters to modify the consult
	 * ```
	 * query:{fields:'id', limit:50, offset:0, order:'asc', orderField:'id'}
	 * ```
	 */
	public async list(model: string, query: any): Promise<any> {
		try {
			let { data } = await axios.get(`${dataURL}/${this.engine}/${model}`, {
				params: query,
			});
			return data;
		} catch (error) {
			if (error.response.status === "400") throw new Error("BD_SYNTAX_ERROR");
			throw new Error(`Error en conexion connection la BD, error: ${error.response.status}`);
		}
	}

	/**
	 * This function return the object especified if exist
	 * @param model model of the table
	 * @param id id of the register in the table
	 * @param query paramaters to modify the consult
	 * ```
	 * query:{fields:'id', limit:50, offset:0, order:'asc', orderField:'id'}
	 * ```
	 */
	public async get(model: string, id: string | number, query: any): Promise<any> {
		try {
			let { data } = await axios.get(`${dataURL}/${this.engine}/${model}/${id}`, {
				params: query,
			});
			return data;
		} catch (error) {
			if (error.response.status === "400") throw new Error("BD_SYNTAX_ERROR");
			throw new Error(`Error en conexion connection la BD, error: ${error.response.status}`);
		}
	}

	/**
	 * This function return a collection of objects filtered by other
	 * @param model model of the table
	 * @param id id of register in the table
	 * @param other model of the other entity
	 * @param query parameters to modify the consult
	 * ```
	 * query:{fields:'id', limit:50, offset:0, order:'asc', orderField:'id'}
	 * ```
	 */
	public async filter(model: string, id: string | number, other: string, query: any): Promise<any> {
		try {
			let { data } = await axios.get(`${dataURL}/${this.engine}/${model}/${id}/${other}`, {
				params: query,
			});
			return data;
		} catch (error) {
			if (error.response.status === "400") throw new Error("BD_SYNTAX_ERROR");
			throw new Error(`Error en conexion connection la BD, error: ${error.response.status}`);
		}
	}

	/**
	 * Used to execute a custom query on the data service
	 * @param sql The SQL sentence to excute
	 */
	public async query(sql: string): Promise<any> {
		try {
			let { data } = await axios.post(`${dataURL}/${this.engine}/query`, { sql: sql });
			return data;
		} catch (error) {
			if (error.response.status === "400") throw new Error("BD_SYNTAX_ERROR");
			throw new Error(`Error en conexion connection la BD, error: ${error.response.status}`);
		}
	}

	/**
	 * This function create a new register in the bd
	 * @param model model of the table
	 * @param object the new object to introduce in the db
	 */
	public async insert(model: string, object: any): Promise<any> {
		try {
			let { data } = await axios.post(`${dataURL}/${this.engine}/${model}/`, {
				data: object,
			});
			return data;
		} catch (error) {
			if (error.response.status === "400") throw new Error("BD_SYNTAX_ERROR");
			throw new Error(`Error en conexion connection la BD, error: ${error.response.status}`);
		}
	}

	/**
	 * This function create a bunch of new registers in the bd
	 * @param model model of the table
	 * @param object the new object to introduce in the db
	 */
	public async inserts(model: string, array: any): Promise<any> {
		try {
			let { data } = await axios.post(`${dataURL}/${this.engine}/${model}/many`, {
				data: array,
			});
			return data;
		} catch (error) {
			if (error.response.status === "400") throw new Error("BD_SYNTAX_ERROR");
			throw new Error(`Error en conexion connection la BD, error: ${error.response.status}`);
		}
	}

	/**
	 * Method dedicated to update the data of an entity
	 * @param model Model of the entity
	 * @param id Identifier of the entity
	 * @param object The data to upsert
	 */
	public async upsert(model: string, id: string | number, object: any): Promise<any> {
		try {
			let { data } = await axios.post(`${dataURL}/${this.engine}/${model}/${id}`, {
				data: object,
			});
			return data;
		} catch (error) {
			if (error.response.status === "400") throw new Error("BD_SYNTAX_ERROR");
			throw new Error(`Error en conexion connection la BD, error: ${error.response.status}`);
		}
	}

	/**
	 * This function delete a register from de bd
	 * @param model model of the table
	 * @param id id of the register
	 */
	public async remove(model: string, id: string | number): Promise<any> {
		try {
			let { data } = await axios.delete(`${dataURL}/${this.engine}/${model}/${id}`);
			return data;
		} catch (error) {
			if (error.response.status === "400") throw new Error("BD_SYNTAX_ERROR");
			throw new Error(`Error en conexion connection la BD, error: ${error.response.status}`);
		}
	}

	/**
	 * This function return the total count of register in a table
	 * @param model model of the table
	 */
	public async count(model: string): Promise<any> {
		try {
			let { data } = await axios.get(`${dataURL}/${this.engine}/count/${model}`);
			return data;
		} catch (error) {
			if (error.response.status === "400") throw new Error("BD_SYNTAX_ERROR");
			throw new Error(`Error en conexion connection la BD, error: ${error.response.status}`);
		}
	}

	/**
	 * This function return the count of all register related to other table
	 * @param model the model of the table
	 * @param other the other table
	 * @param id the id of the register
	 */
	public async filterCount(model: string, other: string, id: string | number): Promise<number> {
		try {
			let { data } = await axios.get(`${dataURL}/${this.engine}/count/${model}/${id}/${other}`);
			return data;
		} catch (error) {
			if (error.response.status === "400") throw new Error("BD_SYNTAX_ERROR");
			throw new Error(`Error en conexion connection la BD, error: ${error.response.status}`);
		}
	}
}

import * as consult from '../../helpers/consult';
import * as links from '../../helpers/links';
import * as respuestas from '../../errors';
import { IConcepto } from './model';
import { dataURL } from 'keys';

const model = 'adm_conceptos';
const submodel = 'adm_presentaciones';
/**
 * Get all last concepts
 * @param query modifier of the consult
 */
export const get = async (query: any): Promise<any> => {
    try {
        let { fields, limit } = query;

        if(query.fields){
            let aux = query.fields.split(',');
            let filtrados = aux.filter((e:any) => e !== 'presentaciones' && e!=='existencias');
            query.fields = filtrados.join(',');
        }

        let data: IConcepto[] = await consult.get(model, query);// consulto los conceptos
        let totalCount: number = await consult.count(model); // consulto el total de registros de la BD
        let count = data.length;

        // si se encontraron registros
        if (count <= 0) return respuestas.Empty;
        // si no me pasaron campos requeridos o si en los campos estan las presentaciones entonces
        // consulto las presentaciones de ese producto

        for (let i = 0; i < data.length; i++) {
            let { id } = data[i];
            if(!fields || fields.includes('presentaciones')){
                let pres: any[] = await consult.getOtherByMe(model, id as string, submodel, {});
                data[i].presentaciones = pres;
            }
            if(!fields || fields.includes('existencias')){
                let movDep: any[] = await consult.getOtherByMe(model,id as string,'adm_movimiento_deposito',{fields:'adm_depositos_id,existencia'});
                data[i].existencias = movDep;
            }
        }
        
        let link = links.pages(data, model, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get one concept
 * @param id id of the concept
 * @param query modifier of the consult
 */
export const getOne = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let data: IConcepto = await consult.getOne(model, id, query);
        let count = await consult.count(model);
        let { fields } = query;

        if (!data) return respuestas.ElementNotFound;

        if (!fields || fields.includes(submodel)) {
            let pres = await consult.getOtherByMe(model, id as string, submodel, {}) as any[];
            data.presentaciones = pres;
        }
        let link = links.records(data, model, count);
        let response = Object.assign({ data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get all the deposits where the concept it is
 * @param id id of the concept
 * @param query modifier of the consult
 */
export const getDepositsByConcept = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let recurso: IConcepto = await consult.getOne(model, id, { fields: 'id' });

        if (!recurso) return respuestas.ElementNotFound;

        let data: any = await consult.getOtherByMe(model, id, 'adm_movimiento_deposito', { fields: 'adm_depositos_id,existencia' });
        let totalCount = await consult.count('adm_depositos');
        let count = data.length;
        let { limit } = query;

        if (count <= 0) return respuestas.Empty;

        let link = links.pages(data, `conceptos/${id}/depositos`, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };

    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get all the photos of the concept
 * @param id id of the concept
 * @param query modifier of the consult
 */
export const getPhotosByConcept = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let recurso: IConcepto = await consult.getOne(model, id, { fields: 'id' });
        if (!recurso) return respuestas.ElementNotFound;

        let data: any = await consult.getOtherByMe(model, id, 'rest_galeria', query);
        let totalCount = await consult.countOther(model, 'rest_galeria', id);
        let count = data.length;
        let { limit } = query;
        if (count <= 0) return respuestas.Empty;
        let link = links.pages(data, `conceptos/${id}/photos`, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get all the presentations of the concept
 * @param id id of the concept
 * @param query modifier of the consult
 */
export const getPresentationsByConcept = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let recurso: IConcepto = await consult.getOne(model, id, { fields: 'id' });
        if (!recurso) return respuestas.ElementNotFound;
        let data: any = await consult.getOtherByMe(model, id, submodel, query);
        let totalCount = await consult.countOther(model, submodel, id);
        let count = data.length;
        let { limit } = query;
        if (count <= 0) return respuestas.Empty;
        let link = links.pages(data, `conceptos/${id}/presentaciones`, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get one top of the most sold concepts
 * @param params params request object
 * @param query modifier of the consult
 */
export const getMostSold = async (params: any, query: any): Promise<any> =>{
    const { limit , order , } = query; 
    try {
        let sql = `SELECT adm_conceptos.*, SUM(cantidad) AS vendidos FROM adm_det_facturas
        LEFT JOIN adm_conceptos ON adm_conceptos_id = adm_conceptos.id 
        ${query['after-fecha_at'] ? `WHERE adm_det_facturas.fecha_at >= '${query['after-fecha_at']}'`: '' }
        ${query['before-fecha_at'] ? `${query['before-fecha_at'] ? 'AND' : 'WHERE'} adm_det_facturas.fecha_at <= '${query['before-fecha_at']}'`: '' }
        GROUP BY adm_conceptos_id ORDER BY vendidos ${order ? order : 'desc'} LIMIT ${limit ? limit : 10}`;
        let data:any[] = await consult.getPersonalized(sql);
        let totalCount: number = await consult.count(model); // consulto el total de registros de la BD
        let count = data.length;

        if (count <= 0) return respuestas.Empty;
        
        let response = { totalCount, count, data }
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

export async function sellByConcept(params:any,query:any): Promise<any>{
    const { id } = params;
    try {
        let f = makeFields('adm_conceptos',query.fields);
        let where = makeWhere(query,'adm_det_facturas',1);
        let sql = `SELECT ${f}, SUM(cantidad) AS ventas FROM adm_det_facturas
        LEFT JOIN adm_conceptos ON adm_conceptos_id = adm_conceptos.id
        LEFT JOIN adm_enc_facturas ON adm_enc_facturas_id = adm_enc_facturas.id 
        WHERE adm_conceptos_id=${id} ${where} AND adm_enc_facturas.adm_tipos_facturas_id = '1' OR 
        adm_enc_facturas.adm_tipos_facturas_id = '5'`;

        let concepto: any[] = await consult.getPersonalized(sql);
        if(!concepto[0]) return respuestas.ElementNotFound;
        let data = concepto[0];
        data.ventas = parseFloat(data.ventas).toFixed(2);
        let response = { data }
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

function makeWhere(query: any, tabla: any, ind:number) {
    let where = "";
    var index = ind || 0;
    for (const prop in query) {
        if (prop !== 'fields' && prop !== 'limit' && prop !== 'order' && prop !== 'orderField' && prop !== 'offset' && !prop.includes('ext')) {
            if (prop.includes('after') || prop.includes('before')) {
                if (prop.split('-').length > 1) {
                    where += (index == 0) ? " WHERE " : " AND ";
                    where += `${tabla}.${prop.split('-')[1]} ${prop.split('-')[0] === 'before' ? '<=' : '>='} '${query[prop]}'`;
                    index++;
                }
            } else if (Array.isArray(query[prop])) {
                where += (index == 0) ? " WHERE " : " AND ";
                where += `${tabla}.${prop} in(${query[prop].join(",")}) `;
                index++;
            } else {
                where += (index == 0) ? " WHERE " : " AND ";
                where += `${tabla}.${prop} like '%${query[prop]}%'`;
                index++;
            }
        }

    }
    return where;
}

function makeFields(tabla:string,fields:string){
    if(!fields) return `${tabla}.*`;
    let f = fields.split(',');
    for (let index = 0; index < f.length; index++) {
        f[index] = `${tabla}.${f[index]}`;
    }
    fields = f.join(',');
    return fields;
}

export async function devolutionsByConcept(params:any, query:any): Promise<any>{
    try {
        let { id } = params;
        let f = makeFields('adm_conceptos',query.fields);
        let where = makeWhere(query,'adm_det_facturas',1);
        let sql = `SELECT ${f}, SUM(cantidad) AS devoluciones FROM adm_det_facturas
        LEFT JOIN adm_conceptos ON adm_conceptos_id = adm_conceptos.id
        LEFT JOIN adm_enc_facturas ON adm_enc_facturas_id = adm_enc_facturas.id 
        WHERE adm_conceptos_id=${id} ${where} AND adm_enc_facturas.adm_tipos_facturas_id = '3' `;

        let concepto: any[] = await consult.getPersonalized(sql);
        if(!concepto[0]) return respuestas.ElementNotFound;
        let data = concepto[0];
        data.devoluciones = parseFloat(data.devoluciones).toFixed(2);
        let response = { data }
        return { response, code: respuestas.Ok.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}


/**
 * Create a new concept
 * @param body data of the concept
 */
export const create = async (body: any, file: any): Promise<any> => {
    let { data, data1 } = body;
    let newConcepto: IConcepto = typeof data == 'string' ? JSON.parse(data) : data;
    if(file){
        let { filename = 'default.png' } = file;
        newConcepto.imagen = filename;
    } 
    let presentaciones = data1;
    try {
        let { insertId } = await consult.create(model, newConcepto) as any;
        if (presentaciones) {
            presentaciones.forEach(async (element: any) => {
                element.adm_conceptos_id = insertId;
            });
            await consult.insertMany(submodel, presentaciones);
            newConcepto.presentaciones = presentaciones;
        }
        newConcepto.id = insertId;
        let link = links.created(model, insertId);
        let response = { message: respuestas.Created.message ,data:newConcepto, link: link };
        return { response, code: respuestas.Created.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Update a concept
 * @param params params request object
 * @param query data of the concept
 */
export const update = async (params: any, body: any, file: any): Promise<any> => {
    let { id } = params;
    let { data, data1 } = body;
    let newGrupo: IConcepto = typeof data == 'string' ? JSON.parse(data) : data;
    let presentaciones = data1;
    if(file) newGrupo.imagen = file.filename;
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let { affectedRows } = await consult.update(model, id, newGrupo) as any;
        if (presentaciones) {
            presentaciones.forEach(async (element: any) => {
                await consult.update(submodel, element.id, element);
            });
        }
        let link = links.created(model, id);
        let response = Object.assign({ message: respuestas.Update.message, affectedRows }, { link: link });
        return { response, code: respuestas.Update.code };
    } catch (error) {
        if (error.message === 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Delete a concept
 * @param params params request object
 */
export const remove = async (params: any): Promise<any> => {
    let { id } = params;
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let pres = await consult.getOtherByMe(model, id as string, submodel, {}) as any[];
        pres.forEach(async (element: any) => {
            await consult.remove(submodel, element.id);
        });
        await consult.remove(model, id);
        return respuestas.Deleted;
    } catch (error) {
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}
const chalk = require('chalk');

const { MySQLConnection } = require('./database');
const Query = require('./querys');
const db = new MySQLConnection();
const querys = new Query();

/**
 * This function get all of the elements on the table
 * @param {string} model  model of the table 
 * @param {Object} query paramaters to modify the consult
 * ```
 * query:{fields:'id', limit:50, offset:0, order:'asc', orderField:'id'}
 * ``` 
 */
async function get(model, query) {
    let sql = querys.selectSQL(query, model);
    try {
        let data = await db.connection.query(sql);
        let response = JSON.parse(JSON.stringify(data[0]));
        return response;
    } catch (error) {
        if (error.code === 'ER_PARSE_ERROR' || error.code === 'ER_BAD_FIELD_ERROR') {
            console.log(`${chalk.red('[ERROR]')} ${error}`);
            throw new Error('BD_SYNTAX_ERROR');
        }
        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.log(`${chalk.red('[ERROR]')} ${error}`);
            throw new Error('BD_TABLE_ERROR');
        }
        throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
    }
}

/**
 * This function return the object especified if exist
 * @param {string} model model of the table
 * @param {number} id id of the register in the table
 * @param {Object} query paramaters to modify the consult
 * ```javascript
 *- query:{
 *-      fields:'id',
 *-      limit:50, 
 *-      offset:0,
 *-      order:'asc',
 *-      orderField:'id'
 *- }
 * ```
 */
async function getOne(model, id, query) {
    let sql = querys.selectSQLOne(id, query, model);
    try {
        let data = await db.connection.query(sql);
        if (!data[0][0]) return null;
        let response = JSON.parse(JSON.stringify(data[0][0]));
        return response;
    } catch (error) {
        if (error.code === 'ER_PARSE_ERROR' || error.code === 'ER_BAD_FIELD_ERROR') {
            console.log(`${chalk.red('[ERROR]')} ${error}`);
            throw new Error('BD_SYNTAX_ERROR');
        }
        throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
    }
}

/**
 * This function return a collection of objects filtered by other entity on the database
 * @param {string} model model of the table
 * @param {number} id id of register in the table
 * @param {string} other model of the other entity
 * @param {Object} query parameters to modify the consult
 * ```
 * query:{fields:'id', limit:50, offset:0, order:'asc', orderField:'id'}
 * ```
 */
async function getOtherByMe(model, id, other, query) {
    let sql = querys.selectByFilter(query, other, model, id);
    try {
        let data = await db.connection.query(sql);
        return data[0];
    } catch (error) {
        if (error.code === 'ER_PARSE_ERROR' || error.code === 'ER_BAD_FIELD_ERROR') {
            console.log(`${chalk.red('[ERROR]')} ${error}`);
            throw new Error('BD_SYNTAX_ERROR');
        }
        throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
    }
}

/**
 * This function create a new register in the bd
 * @param {string} model model of the table
 * @param {Object} object the new object to introduce in the db
 */
async function create(model, object) {
    try {
        let inserted = await db.connection.query(`INSERT INTO ${model} set ?`, [object]);
        return inserted[0];
    } catch (error) {
        if (error.code === 'ER_PARSE_ERROR' || error.code === 'ER_BAD_FIELD_ERROR' || error.code === 'ER_NO_REFERENCED_ROW_2') {
            console.log(`${chalk.red('[ERROR]')} ${error}`);
            throw new Error('BD_SYNTAX_ERROR');
        }
        throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
    }
}

/**
 * Insert an array of objects on a table
 * @param {string} model the table to insert 
 * @param {Array} array the object of the data
 */
async function insertMany(model, array) {
    try {
        let arrVals = [];
        array.forEach(element => {
            arrVals.push(Object.values(element));
        });
        let fields = querys.makeInsert(array[0]);
        let inserted = await db.connection.query(`INSERT INTO ${model} (${fields}) VALUES ?`, [arrVals]);
        return inserted[0];
    } catch (error) {
        if (error.code === 'ER_PARSE_ERROR' || error.code === 'ER_BAD_FIELD_ERROR' || error.code === 'ER_NO_REFERENCED_ROW_2') {
            console.log(`${chalk.red('[ERROR]')} ${error}`);
            throw new Error('BD_SYNTAX_ERROR');
        }
        throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
    }
}

/**
 * This function update a register in the bd
 * @param {string} model model of the table
 * @param {number} id id of the register in the table
 * @param {Object} object object to update in the db
 */
async function update(model, id, object) {
    try {
        let updated = await db.connection.query(`UPDATE ${model} set ? WHERE id = ?`, [object, id]);
        return updated[0];
    } catch (error) {
        if (error.code === 'ER_PARSE_ERROR' || error.code === 'ER_BAD_FIELD_ERROR' || error.code === 'ER_NO_REFERENCED_ROW_2') {
            console.log(`${chalk.red('[ERROR]')} ${error}`);
            throw new Error('BD_SYNTAX_ERROR');
        }
        throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
    }
}

/**
 * This function delete a register from de bd
 * @param {string} model model of the table
 * @param {number} id id of the register
 */
async function remove(model, id) {
    try {
        let deleted = await db.connection.query(`DELETE FROM ${model} WHERE id = ? `, [id]);
        return deleted;
    } catch (error) {
        throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
    }
}

/**
 * Execute a custom SQL sentence
 * @param {string} sql SQL sentence to execute
 */
async function query(sql) {
    try {
        let data = await db.connection.query(sql);
        return data[0];
    } catch (error) {

        if (error.code === 'ER_PARSE_ERROR' || error.code === 'ER_BAD_FIELD_ERROR') {
            console.log(`${chalk.red('[ERROR]')} ${error}`);
            throw new Error('BD_SYNTAX_ERROR');
        }
        throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
    }
}

/**
 * This function return the total count of register in a table
 * @param {string} model model of the table
 */
async function count(model) {
    try {
        let count = await db.connection.query(`SELECT COUNT(id) as total FROM ${model}`);
        let total = count[0][0].total;
        return total;
    } catch (error) {
        throw new Error(`Error en conexion db.connection la BD, error: ${error}`);
    }
}

/**
 * This function return the count of all register related to other table
 * @param {string} model the model of the table
 * @param {number} id the id of the register
 * @param {string} other the other table
 */
async function countOther(model, id, other) {
    try {
        let count = await db.connection.query(`SELECT COUNT(id) as total FROM ${other} WHERE ${model}_id = ${id}`);
        let total = count[0][0].total;
        return total;
    } catch (error) {
        throw new Error(`Error en conexion db.connection la BD, error: ${other}`);
    }
}

/**
 * Library responsible for handling database queries
 */
module.exports = {
    get,
    getOne,
    getOtherByMe,
    create,
    insertMany,
    update,
    remove,
    query,
    count,
    countOther
};
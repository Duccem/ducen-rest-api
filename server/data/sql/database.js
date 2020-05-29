const { database } = require('../keys');
const { createPool } = require('mysql2/promise');
const chalk = require('chalk');

/**
 * The Database class
 * Used to manage the driver to connect to database engine MySQL
 */
class MySQLConnection {
    constructor(data = null) {
        let configuration = data || database;
        try {
            this.connection = createPool(configuration);
            if (this.connection) console.log(`${chalk.green('[DATABASE]')} connected to ${configuration.database} database`);
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} ${error}`)
            this.connection = null;
        }
    }
}

module.exports = { MySQLConnection };
const cors = require('cors');
const chalk = require('chalk');
const morgan = require('morgan');
const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
const routes = require('./router');

/**
 * Principal class to execute the microservice
 */
class App {
    /**
     * 
     * @param {number} port the number of the port where the app is started to listen
     */
    constructor(port = null) {
        this.port = port;
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }
    /**
     * Set the configuration variables
     */
    settings() {
        this.app.set('port', this.port || process.argv[2] || process.env.PORT || 83);
    }

    /**
     * The middlewares functions to parse requests
     */
    middlewares() {
        this.app.use(cors({ exposedHeaders: 'Authorization' }));
        this.app.use(morgan("dev"));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    /**
     * Handling the routes of the API on the dedicated file  
    */
    routes() {
        routes(this.app);
    }

    /**
     * Function to start the server
     */
    listen() {
        this.app.listen(this.app.get('port'));
        console.log(`${chalk.yellow('[SERVER]')} running on port ${this.app.get('port')}`);
    }
}

module.exports = App;
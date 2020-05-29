const { MongoClient } = require('mongodb');
const { database } = require('../keys');

class MongoDBConnection {
    constructor(data = null) {
        let configuration = data || database;
        MongoClient.connect('mongodb://localhost:21017', { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log(err);
                process.exit(0);
            }
            this.connection = client.db(configuration);
            console.log('DB is connected')
        });
    }
}

module.exports = {
    MongoDBConnection
};
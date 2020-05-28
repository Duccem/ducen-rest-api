const App = require('./app');
const dotenv = require('dotenv');
dotenv.config();

function main() {
    const app = new App();
    app.listen();
}

main();
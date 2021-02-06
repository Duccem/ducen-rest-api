import { App } from './app';

function main() {
	const app = new App();
	app.bootstrap().then(()=> app.listen())
}

main();

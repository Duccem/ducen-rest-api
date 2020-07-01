export const swaggerDocument = {
	openapi: "3.0.1",
	info: {
		version: "4.0.0",
		title: "Ducen REST API",
		description: "API using the octagonal architecture and microservice, multitenant data service and others features",
		termOfService: "",
		contact: {
			name: "Jose Veliz (Duccem29)",
			email: "ducen29@gmail.com",
			url: "https://duccem.github.io",
		},
		license: {
			name: "Apache 2.0",
			url: "https://www.apache.org/licenses/LICENSE-2.0.html",
		},
		servers: [
			{
				url: "http://localhost/api/",
				description: "Local server",
			},
			{
				url: "https://ducen-rest-api.herokuapp.com/api",
				description: "DEV server",
			},
		],
	},
};

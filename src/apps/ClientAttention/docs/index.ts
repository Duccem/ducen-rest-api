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
	paths: {
		"/users/signup": {
			post: {
				summary: "Create a new user",
				tags: ["Users"],
				description: "Create a new user and generate the keys to operate over the api",
				operationId: "signup",
				parameters: [
					{
						name: "user",
						in: "body",
						description: "Data of the new user",
						required: true,
						schema: {
							$ref: "#/components/schemas/newUser",
						},
					},
				],
				responses: {
					201: {
						description: "Created",
						content: {
							"aplication/json": {
								schema: {
									$ref: "#/components/schemas/AuthPayload",
								},
							},
						},
					},
					400: {
						description: "The email is already in use Or the password must be longer than 6 characters",
						content: {
							"aplication/json": {
								schema: {
									$ref: "#/components/schemas/Error",
								},
							},
						},
					},
				},
			},
		},
		"/users/login": {
			post: {
				summary: "Log in user in the app",
				tags: ["Users", "Auth", "Login"],
				description: "Log in to generate a new token key",
				operationId: "login",
				parameters: [
					{
						name: "user",
						in: "body",
						description: "name/email and password of the user",
						required: true,
						schema: {
							$ref: "#/components/schemas/newUser",
						},
					},
				],
				responses: {
					200: {
						description: "Logged",
						content: {
							"aplication/json": {
								schema: {
									$ref: "#/components/schemas/AuthPayload",
								},
							},
						},
					},
					400: {
						description: "User not found or the password is incorrect",
						content: {
							"aplication/json": {
								schema: {
									$ref: "#/components/schemas/Error",
								},
							},
						},
					},
				},
			},
		},
	},
	components: {
		schemas: {
			User: {
				type: "object",
				allOf: [
					{
						required: ["name", "email", "password"],
						properties: {
							id: {
								type: "integer",
							},
						},
					},
					{
						$ref: "#components/schemas/newUser",
					},
				],
			},
			newUser: {
				type: "object",
				required: ["name", "password", "email"],
				properties: {
					name: {
						type: "string",
					},
					password: {
						type: "string",
					},
					email: {
						type: "string",
					},
				},
			},
			AuthPayload: {
				type: "object",
				required: ["token"],
				properties: {
					token: {
						type: "string",
					},
					user: {
						type: "object",
						properties: {
							name: {
								type: "string",
							},
							email: {
								type: "string",
							},
						},
					},
				},
			},
			Error: {
				type: "object",
				properties: {
					message: {
						type: "string",
					},
				},
			},
		},
	},
};

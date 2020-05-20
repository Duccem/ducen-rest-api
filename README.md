# Complex Backend microservice

An projecto based on nodejs backend server microservices structure

## Usage

```bash
   $ npm install --save
```

## Scripts

-   ### Clean

```bash
   $ npm run clean
```

run this script to delete the dist folder

-   ### Build

```bash
   $ npm run build
```

run this script to compile the source code and create the dist folder

-   ### Start

```bash
   $ npm start:api
   $ npm start:data
   $ npm start:auth
   $ npm start:file
   $ npm start:pages
   $ npm start:nots
```

run this script to start the respective microservice

-   ### Dev

```bash
   $ npm run serve:api
   $ npm run serve:data
   $ npm run serve:auth
   $ npm run serve:file
   $ npm run serve:pages
   $ npm run serve:nots
```

run this script to generate a development server that watch the changes on the code

-   ### Deploy

```bash
   $ npm run deploy
   $ npm run deploy:api
   $ npm run deploy:data
   $ npm run deploy:auth
   $ npm run deploy:file
   $ npm run deploy:pages
   $ npm run deploy:nots
```

run this script to do the clean, build and start at the same time

## Docs

### Authentication

Every call to the api require a header with a token with the developer authorization user and password of the partner.
The token have the next estructure: <code>{"password" : "123456", "user" : "admin"}</code> and the header's name is <code>x-access-control</code>. This user and pasword will be given to you by de company you work for.

### Requests

Requests to the server must be made through the URLs: `http://localhost:81/api/${endpint}/?${query}`, each endpoint will be given for the resource they wish to obtain or mutate, for example: `http://localhost:81/api/conceptos/?limit=20&fields=id,nombre`

#### Query

-   **fields**: This paramater indicate which of the attributes of the entity are required by the user, separated by comma.
-   **offset**: This parameter indicates the index where the data path begins.
-   **limit**: This parameter indicates the lenght of the array of data.
-   **order**: This parameter indicates the order of the array ascendent/descendent.
-   **orderField**: This parameter indicates the key or field by which the array will be ordered.
-   **before**: it gets concatenated before the filter key field to indicate that the records are less than or equal to the value.
-   **after**: it gets concatenated before the filter key field to indicate that the records are greater than or equal to the value.

## Examples

In this case we'll make a request to the endpoint conceptos, requesting all last 50 concepts and we just want
the fields: id, nombre, codigo and precio_dolar. With a price greater than $1.5 and less than $10. We can do this because the api identifies the entity's fields and can filter through them, prefixes such as 'before' or 'after' can be used so that the filtering is less than or greater than a value, as many filters can be concatenated as desired.

Route: `GET: http://localhost:81/api/conceptos/?fields=id,nombre,codigo,precio_dolar&after-precio_dolar=1.5&before-precio_dolar=10`

Code:

```js
//Request
fetch("http://localhost:81/api/conceptos/?fields=id,nombre,codigo,precio_dolar&after-precio_dolar=1.5&before-precio_dolar=10", {
	method: "GET",
	headers: {
		"x-access-control": '{"password" : "123456", "user" : "admin"}',
	},
}).then((response) => {
	var respuesta = JSON.parse(response);
	console.log(response.data);
});
```

Response:

```js
        {
            "totalCount": 6,
            "count": 4,
            "data": [
                {
                    "id": 1,
                    "nombre": "CARNE DE RES DE PRIMERA",
                    "codigo": "04010150541",
                    "precio_dolar": "5.75"
                },
                {
                    "id": 3,
                    "nombre": "PESCADO FRESCO",
                    "codigo": "27323221122",
                    "precio_dolar": "1.97"
                },
                {
                    "id": 4,
                    "nombre": "CARNE MOLIDA",
                    "codigo": "355214235135",
                    "precio_dolar": "5.03"
                },
                {
                    "id": 5,
                    "nombre": "CHORIZO POR BULTO",
                    "codigo": "3573676423",
                    "precio_dolar": "8.23"
                }
            ],
            "sig": "http://localhost:81/api/conceptos/?offset=5&limit=4",
            "prev": "First Page"
        }
```

On the other hand we can also do a request to create data, in this case we'll make a group, the optional fields could be guessed

Route: `POST: http://localhost:81/api/conceptos`

Code:

```js
// we make the object with the data
var data = {
	nombre: "Lacteos",
	imagen: "default.png",
	visualizar: 0,
	posicion: 0,
};

//and make the request
fetch("http://localhost:81/api/conceptos/?fields=id,nombre,codigo,precio_dolar", {
	method: "POST",
	headers: {
		"x-access-control": '{"password" : "123456", "user" : "admin"}',
	},
	body: data,
}).then((response) => {
	var respuesta = JSON.parse(response);
	console.log(response.data);
});
```

Response:

```js
        {
            "message": "Record created",
            "link": "http://localhost:81/api/grupos/14"
        }
```

## Responses and errors

| Response              | Description                                                     | Message                             | Code |
| --------------------- | --------------------------------------------------------------- | ----------------------------------- | ---- |
| Ok                    | Everything was good and the response is expected as desired     | Ok                                  | 200  |
| Created               | The data its saved and the record created successfully          | Record created                      | 201  |
| Updated               | The record was successfuly updated and midificated              | Record updated                      | 201  |
| Deleted               | The record was deleted from the api                             | Record deleted                      | 200  |
| Empty                 | The resquest was good but the endpoint is empty                 | The entity is empty                 | 200  |
| Invalid ID            | The given ID doesn't have the correct numeric format            | The given ID is not valid           | 400  |
| Bad Request           | The route or the data have invalid format or doesn't exist      | Bad Request                         | 400  |
| Unauthorized          | The credentials are missing or are invalids                     | The credentials are invalids        | 401  |
| Forbidden             | The user doesn't have permissions to use this route             | You are not allow to use this route | 403  |
| Element Not Found     | The element requested doesn't exist                             | Element not found                   | 404  |
| Route Not Found       | The route requested doesn't exist                               | Route not found                     | 404  |
| Bad Format            | The format of the data is invalid                               | Format invalid                      | 406  |
| Internal Server Error | An error has ocurred on the server and the request was rejected | Internal server error               | 500  |

## Endpoints

-   **[Areas de atencion](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/areas_atencion "Areas of atention")**
-   **[Banco](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/banco "Bank")**
-   **[Cambio](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/cambio "Currency")**
-   **[Cargo](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/cargos "Charge")**
-   **[Ciudad](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/ciudad "City")**
-   **[Clientes](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/clientes "Clients")**
-   **[Conceptos](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/conceptos "Concepts")**
-   **[Depositos](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/depositos "Depositos")**
-   **[Descargos](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/descargos "ds")**
-   **[Empresa](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/empresa "Company")**
-   **[Entidad](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/Entidad "Entity")**
-   **[Galeria](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/galeria "Gallery")**
-   **[Grupos](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/grupos "Groups")**
-   **[Marcas](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/marcas "Brands")**
-   **[Movimientos de deposito](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/movimiento_depositos "Deposits movements")**
-   **[Pedidos](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/pedidos "Orders")**
-   **[Subgrupos](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/subgrupos "Subgrupos")**
-   **[Tipos](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/tipos "Types")**
-   **[Unidades](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/unidades "Units")**
-   **[Usuario](https://github.com/Duccem/aftim-rest-api/tree/master/src/components/usuario "User")**

## How to run

### Locally

Install dependencies `npm i`.

Have mongodb running on localhost default port 27017

Start server with `ts-node src/server.ts` or `npm run start`

Server will listen on `http://localhost:4111`

### Docker

Run `docker compose up --build`

Server will listen on `http://localhost:4111`

## General

### Data Validation

[create user endpoint](./src/controller/createUser.ts) validates name/email in payload based on [mongoose schema](./src/model/User.ts#L7), went with it instead of more usual middleware validation since i already had schema defined and setting up same validation but in middleware would be unnecessary duplication considering that validation isn't very complex in this case

[get all users endpoint](./src/controller/getAllUsers.ts) validates query params based on [Joi schema](./src/validationSchema.ts) in a middleware way.

### Db seeder

Made a small [db seeder](./src/model/seedDb.ts) to have some data in on the first run, so one dont need to call create user endpoint repeatedly to populate db.

### Test Db

Tests run on separate small in-memory db defined [here](./test/db.ts). Faster, more efficient, doesnt pollute main db with test data.

### Docker setup

[Silenced](./compose.yaml#L6) mongo logs in docker container since they were too verbose and spammy

### Pagination on get all users endpoint

Did a simple offset/limit pagination for [get all users endpoint](./src/controller/getAllUsers.ts).

### API

Could have done swagger/openapi docs, but its only 2 simple endpoints so i decided not to set it all up.

`POST /users`:

Payload schema:
Name|Type|Required|Default|Validation|Description
----|----|-------|-------|------|-----------
`name`|`string`|`yes`||`string, will be trimmed`|`Name of created user`
`email`|`string`|`yes`||`string, unique, valiadated against email regexp will be trimmed and lowercased`|`Email of created user`

Example payload: 
```json
{
	"name": "pew",
	"email": "pew@pew.com"
}
```

Example response:
```json
{
	"name": "pew",
	"email": "pew@pew.com",
	"_id": "66325465813937e8229bacdf",
	"createdAt": "2024-05-01T14:40:37.683Z",
	"updatedAt": "2024-05-01T14:40:37.683Z",
	"__v": 0
}
```

`GET /users`

Query param schema:
Name|Type|Required|Default|Validation|Description
----|----|-------|-------|------|-----------
`created`|`string`|`no`|`"asc"`|`allowed values: ['asc', 'desc', 'ascending', 'descending']`|`Sort response by createdAt in asc or desc`
`skip`|`number`|`no`|0|`number >= 0`|`How many records to skip`
`limit`|`number`|`no`|20|`number >= 0`|`How many records to return in 1 response`

Example response:

```json
{
	"users": [
		{
			"_id": "6632446e13532019af04a2b3",
			"name": "asd",
			"email": "bruh@bruhhh.com",
			"createdAt": "2024-05-01T13:32:30.401Z",
			"updatedAt": "2024-05-01T13:32:30.401Z",
			"__v": 0
		},
		{
			"_id": "66325465813937e8229bacdf",
			"name": "pew",
			"email": "pew@pew.com",
			"createdAt": "2024-05-01T14:40:37.683Z",
			"updatedAt": "2024-05-01T14:40:37.683Z",
			"__v": 0
		}
	],
	"pagination": {
		"skip": 0,
		"limit": 20,
		"totalRecords": 2,
		"recordsLeft": 0
	}
}
```
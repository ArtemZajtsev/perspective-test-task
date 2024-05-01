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
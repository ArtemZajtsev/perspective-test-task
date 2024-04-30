import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express } from 'express';

import connectDB from './model/db';
import { errorLogger, errorResponder, invalidPathHandler } from './middleware';
import router from './router';

dotenv.config();

connectDB();

const app: Express = express();

app.use(cors())
    .use(express.json())
    .options('*', cors())
    .use('/', router)
    .use(errorLogger)
    .use(errorResponder)
    .use(invalidPathHandler);

const port = process.env.PORT || 3111;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express } from 'express';

import { errorLogger, errorResponder, invalidPathHandler } from './middleware';
import connectDB from './model/db';
import router from './router';

dotenv.config();

if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

const app: Express = express();

app.use(cors())
    .use(express.json())
    .options('*', cors())
    .use('/', router)
    .use(errorLogger)
    .use(errorResponder)
    .use(invalidPathHandler);

export default app;

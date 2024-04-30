import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import { AppError } from './utils';

export function errorLogger(err: AppError, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    next(err);
}

export function errorResponder(err: AppError, req: Request, res: Response, next: NextFunction) {
    const status = err.statusCode || 500;

    return res.status(status).json({
        error: err.message,
    });
}

export function invalidPathHandler(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    res.send('path not found');
}

export function validateQueryParams(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.validate(req.query);

        if (result.error) {
            return res.status(400).json({
                error: result.error.details[0].message,
            });
        }

        next();
    };
}

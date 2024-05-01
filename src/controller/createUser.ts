import { NextFunction, Request, Response } from 'express';
import User from '../model/User';
import { AppError } from '../utils';

export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email } = req.body;

        const user = new User({ name, email });
        const savedUser = await user.save();

        return res.status(201).json(savedUser);
    } catch (err) {
        if (err.message.includes('E11000 duplicate key error collection')) {
            err = new AppError(409, 'This email already exist');
        }

        if (err.message.includes('validation failed')) {
            err = new AppError(400, err.message);
        }

        console.log('Error while creating user: ', err.message);
        next(err);
    }
}

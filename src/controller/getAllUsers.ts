import { NextFunction, Request, Response } from 'express';
import { SortOrder } from 'mongoose';
import User from '../model/User';

// went with simple offset/limit pagination, with bigger data set would be bettwer to use cursor pagination
export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const sortOrder = req.query?.created as SortOrder || 'asc';
        const skip = Number(req.query?.skip) || 0;
        const limit = Number(req.query?.limit) || 20

        const usersCount = await User.estimatedDocumentCount();

        const users = await User
            .find()
            .sort({ createdAt: sortOrder })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            users,
            pagination: {
                skip: skip,
                limit,
                totalRecords: usersCount,
                recordsLeft: Math.max(usersCount - skip - limit, 0)
            }
        });
    } catch (err) {
        console.log('Error while getting all users:', err.message);
        next(err);
    }
}
import express from 'express';
import { createUser } from './controller/createUser';
import { getAllUsers } from './controller/getAllUsers';
import { validateQueryParams } from './middleware';
import { getAllUsersQueryParamsSchema } from './validationSchema';

export const usersPrefix = '/users';

const router = express.Router();

router.post(usersPrefix, createUser);
router.get(usersPrefix, validateQueryParams(getAllUsersQueryParamsSchema), getAllUsers);

export default router;

import Joi from 'joi';

export const getAllUsersQueryParamsSchema = Joi.object().keys({
    created: Joi.string().valid('asc', 'desc', 'ascending', 'descending'),
    skip: Joi.number().min(0),
    limit: Joi.number().min(0),
});

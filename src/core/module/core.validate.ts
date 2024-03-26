import { Joi } from 'express-validation';

export const coreQueryDto = {
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(-1),
  offset: Joi.number().integer().min(0),
  search: Joi.string(),
  sort: Joi.string(),
};

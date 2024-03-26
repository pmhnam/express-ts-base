import { coreQueryDto } from '@src/core/module/core.validate';
import { Joi } from 'express-validation';

export const joiUser = {
  id: Joi.string(),
  username: Joi.string().min(3).max(16),
  email: Joi.string().email(),
  first_name: Joi.string().min(1).max(32),
  last_name: Joi.string().min(1).max(32),
  password: Joi.string().min(8),
  email_verified: Joi.boolean(),
  country_code: Joi.string(),
  phone_number: Joi.string(),
  phone_number_verified: Joi.boolean(),
  reset_password: Joi.boolean(),
  enabled_2fa: Joi.boolean(),
};

export const getUsersValidatorDto = {
  query: Joi.object({
    ...coreQueryDto,
    f_username: joiUser.username.optional(),
    f_email: joiUser.email.optional(),
    f_first_name: joiUser.first_name.optional(),
    f_last_name: joiUser.last_name.optional(),
  }),
};

export const getUserByIdDto = {
  params: Joi.object({
    id: joiUser.id.required(),
  }),
};

export const putUserByIdDto = {
  params: Joi.object({
    id: joiUser.id.required(),
  }),
  body: Joi.object({
    username: joiUser.username.optional(),
    email: joiUser.email.optional(),
    first_name: joiUser.first_name.optional(),
    last_name: joiUser.last_name.optional(),
    password: joiUser.password.optional(),
    email_verified: joiUser.email_verified.optional(),
    country_code: joiUser.country_code.optional(),
    phone_number: joiUser.phone_number.optional(),
    phone_number_verified: joiUser.phone_number_verified.optional(),
    reset_password: joiUser.reset_password.optional(),
    enabled_2fa: joiUser.enabled_2fa.optional(),
  }),
};

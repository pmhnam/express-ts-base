import { Joi, schema } from 'express-validation';

export const loginValidatorDto: schema = {
  body: Joi.object({
    username: Joi.string().min(3).max(16).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).required(),
  }).or('username', 'email'),
};

export const registerValidatorDto: schema = {
  body: Joi.object({
    username: Joi.string().min(3).max(16).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    rePassword: Joi.string().required().valid(Joi.ref('password')).label('repeat password').messages({
      'any.only': '{{#label}} does not match',
    }),
    first_name: Joi.string().min(1).max(32).required().label('first name'),
    last_name: Joi.string().min(1).max(32).required().label('last name'),
  }),
};

export const forgotPasswordValidatorDto: schema = {
  body: Joi.object({
    username: Joi.string().min(3).max(16).optional(),
    email: Joi.string().email().optional(),
  }).or('username', 'email'),
};

export const resetPasswordValidatorDto: schema = {
  body: Joi.object({
    username: Joi.string().min(3).max(16).optional(),
    email: Joi.string().email().optional(),
    newPassword: Joi.string().min(8).required().label('new password'),
    rePassword: Joi.string().required().valid(Joi.ref('newPassword')).label('repeat password'),
    otp: Joi.string().min(6).required(),
  }).or('username', 'email'),
};

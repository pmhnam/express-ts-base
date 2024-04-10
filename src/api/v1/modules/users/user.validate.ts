import { Joi } from 'express-validation';
import { coreQueryDto } from '@coreModuleV1/core.validate';
import { ACCOUNT_STATUS } from '@utilsV1/constants/enum';

export const joiUser = {
  id: Joi.string(),
  username: Joi.string().min(3).max(16),
  email: Joi.string().email(),
  firstName: Joi.string().min(1).max(32),
  lastName: Joi.string().min(1).max(32),
  password: Joi.string().min(8),
  emailVerified: Joi.boolean(),
  countryCode: Joi.string(),
  phoneNumber: Joi.string(),
  phoneNumberVerified: Joi.boolean(),
  resetPassword: Joi.boolean(),
  enabled2fa: Joi.boolean(),
  status: Joi.string().valid(...Object.values(ACCOUNT_STATUS)),
  roleId: Joi.string(),
};

export const getUsersValidatorDto = {
  query: Joi.object({
    ...coreQueryDto,
    f_username: joiUser.username.optional(),
    f_email: joiUser.email.optional(),
    f_firstName: joiUser.firstName.optional(),
    f_lastName: joiUser.lastName.optional(),
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
    firstName: joiUser.firstName.optional(),
    lastName: joiUser.lastName.optional(),
    password: joiUser.password.optional(),
    emailVerified: joiUser.emailVerified.optional(),
    countryCode: joiUser.countryCode.optional(),
    phoneNumber: joiUser.phoneNumber.optional(),
    phoneNumberVerified: joiUser.phoneNumberVerified.optional(),
    status: joiUser.status.optional(),
    enabled2fa: joiUser.enabled2fa.optional(),
    roleId: joiUser.roleId.optional(),
  }),
};

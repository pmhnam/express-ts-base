import { ACCOUNT_STATUS } from '@src/utils/constants/enum';

export interface IUpdateUserDto {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  email_verified?: boolean;
  country_code?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  otp?: string;
  otp_expires?: Date | string;
  forgot_password_code?: string;
  forgot_password_code_expires?: Date | string;
  reset_password?: boolean;
  enabled_2fa?: boolean;
  secret_2fa?: string;
  status?: ACCOUNT_STATUS;

  updatedBy: string;
}

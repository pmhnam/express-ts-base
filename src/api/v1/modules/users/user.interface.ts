import { ACCOUNT_STATUS } from '@src/utils/constants/enum';

export interface IUpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  emailVerified?: boolean;
  countryCode?: string;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  otp?: string;
  otpExpires?: Date | string;
  forgot_passwordCode?: string;
  forgot_passwordCodeExpires?: Date | string;
  reset_password?: boolean;
  enabled2fa?: boolean;
  secret2fa?: string;
  status?: ACCOUNT_STATUS;

  updatedBy: string;
}

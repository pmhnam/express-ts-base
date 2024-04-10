/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@configs/logger';
import sgMail from '@configs/sendgrid';
import { config } from 'dotenv';
import otpGenerator from 'otp-generator';

config();

export const generateOTP = (
  length = 6,
  options?: {
    digits?: boolean;
    lowerCaseAlphabets?: boolean;
    upperCaseAlphabets?: boolean;
    specialChars?: boolean;
  }
) => {
  return otpGenerator.generate(length, {
    digits: true,
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    ...options,
  });
};

export const sendMail = async (
  dto: { to: string; subject: string; text?: string; html: string },
  isMultiple = false
) => {
  const isTestMode = process.env.NODE_ENV === 'test';
  if (isTestMode) {
    return;
  }

  const from = process.env.SENDGRID_FROM_EMAIL || 'noreply@hnam.id.vn';
  try {
    await sgMail.send({ ...dto, from }, isMultiple);
  } catch (error: any) {
    logger.error(`Send mail to ${dto.to} error`, { metadata: { dto, error: error.response?.body } });
  }
};

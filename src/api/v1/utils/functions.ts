import otpGenerator from 'otp-generator';

export const generateOTP = (
  length = 6,
  options?: {
    digits?: boolean;
    lowerCaseAlphabets?: boolean;
    upperCaseAlphabets?: boolean;
    specialChars?: boolean;
  }
) => {
  return otpGenerator.generate(length, { ...options, digits: true, specialChars: false });
};

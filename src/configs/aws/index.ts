import AWS from 'aws-sdk';
import { config } from 'dotenv';

config();

const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_SIGNATURE_VERSION } = process.env;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
  signatureVersion: AWS_SIGNATURE_VERSION,
});

export default AWS;

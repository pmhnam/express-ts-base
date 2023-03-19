import AWS from '@src/configs/aws';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

config();

class UploadS3 {
  private s3: AWS.S3;
  public readonly bucket_name: string = process.env.S3_BUCKET_NAME || '';
  public readonly expires_time: number = Number(process.env.S3_EXPIRES_TIME) || 30 * 60;

  constructor() {
    this.s3 = new AWS.S3();
  }

  public async upload(type: string = 'image'): Promise<any> {
    const key = `uploads/${type}/${uuidv4()}_`;
    const params = {
      Bucket: this.bucket_name,
      Fields: { acl: 'public-read', success_action_status: '201' },
      Expires: this.expires_time,
      ACL: 'public-read',
      Conditions: [{ acl: 'public-read' }, { success_action_status: '201' }, ['starts-with', '$key', key]],
    };
    const preSignedUrl = this.s3.createPresignedPost(params);
    preSignedUrl.fields.key = `${key}\${filename}`;
    return preSignedUrl;
  }
}

export default new UploadS3();

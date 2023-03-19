import jsonwebtoken from 'jsonwebtoken';

export interface IJWTPayload {
  id: string;
  email: string;
  role: string;
}

export class JWT {
  private readonly secret_key: string = process.env.JWT_SECRET_KEY || '';
  private readonly expires_time: number = Number(process.env.JWT_EXPIRES_TIME) || 30 * 60;
  private jwt: typeof jsonwebtoken;

  constructor() {
    this.jwt = jsonwebtoken;
  }

  public async sign(payload: IJWTPayload): Promise<string> {
    return this.jwt.sign(payload, this.secret_key, { expiresIn: this.expires_time });
  }

  public verify(token: string): any {
    return this.jwt.verify(token, this.secret_key);
  }

  public decode(token: string): any {
    return this.jwt.decode(token);
  }

  public getExpiresTime(): number {
    return this.expires_time;
  }

  public getSecretKey(): string {
    return this.secret_key;
  }
}

export default new JWT();

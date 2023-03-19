import { CustomSuccess } from '@src/api/v2/middlewares';

declare global {
  namespace Express {
    export interface Response {
      onSuccess: (data: unknown, custom?: CustomSuccess) => unknown;
    }
    export interface Request {
      rawBody?: string;
      locals: {
        isAuth?: boolean;
      };
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};

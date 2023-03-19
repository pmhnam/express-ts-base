import { CustomSuccess } from '@src/configs/middlewares/response.middleware';

declare global {
  namespace Express {
    export interface Response {
      onSuccess: (data: unknown, custom?: CustomSuccess) => unknown;
    }
    interface Request extends Request {
      rawBody?: string;
      locals: {
        isAuth?: boolean;
      };
      user?: {
        id: string;
        email?: string;
        username?: string;
        role?: string;
        [key: string]: unknown;
      };
      requestId?: string;
    }
  }
}

export {};

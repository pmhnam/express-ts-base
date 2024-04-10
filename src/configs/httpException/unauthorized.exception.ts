import { IOptionsLoggerDto } from '@configs/logger';
import { HTTPException } from './httpException';

export class UnauthorizedHTTP extends HTTPException {
  constructor(message = 'Unauthorized', opts?: IOptionsLoggerDto) {
    super(message, 401, opts);
    this.name = 'Unauthorized';
  }
}

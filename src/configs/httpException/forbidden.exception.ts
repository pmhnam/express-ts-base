import { IOptionsLoggerDto } from '../logger';
import { HTTPException } from './httpException';

export class ForbiddenHTTP extends HTTPException {
  constructor(message = 'Forbidden', opts?: IOptionsLoggerDto) {
    super(message, 403, opts);
    this.name = 'HttpForbiddenException';
  }
}

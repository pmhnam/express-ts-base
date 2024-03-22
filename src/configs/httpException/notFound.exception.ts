import { IOptionsLoggerDto } from '../logger';
import { HTTPException } from './httpException';

export class NotFoundHTTP extends HTTPException {
  constructor(message = 'Not Found', opts?: IOptionsLoggerDto) {
    super(message, 404, opts);
    this.name = 'HTTPNotFoundException';
  }
}

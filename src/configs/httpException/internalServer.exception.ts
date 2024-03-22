import { IOptionsLoggerDto } from '../logger';
import { HTTPException } from './httpException';

export class InternalServerHTTP extends HTTPException {
  constructor(message = 'Internal Server Error', opts?: IOptionsLoggerDto) {
    super(message, 500, opts);
    this.name = 'InternalServerException';
  }
}

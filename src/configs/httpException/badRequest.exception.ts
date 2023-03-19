import { IOptionsLoggerDto } from '../logger';
import { HTTPException } from './httpException';

export class BadRequestHTTP extends HTTPException {
  constructor(message = 'Bad Request', opts?: IOptionsLoggerDto) {
    super(message, 400, opts);
    this.name = 'BadRequest';
  }
}

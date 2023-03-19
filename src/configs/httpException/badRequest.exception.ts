import { HTTPException } from './httpException';

export class BadRequestHTTP extends HTTPException {
  constructor(message = 'Bad Request') {
    super(message, 400);
    this.name = 'BadRequest';
  }
}

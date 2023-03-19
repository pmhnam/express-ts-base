import { HTTPException } from './httpException';

export class InternalServerHTTP extends HTTPException {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
    this.name = 'InternalServerException';
  }
}

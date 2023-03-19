import { HTTPException } from './httpException';

export class UnauthorizedHTTP extends HTTPException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'HTTPUnauthorized';
  }
}

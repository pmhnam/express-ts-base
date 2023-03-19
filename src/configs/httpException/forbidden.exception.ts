import { HTTPException } from './httpException';

export class ForbiddenHTTP extends HTTPException {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'HttpForbiddenException';
  }
}

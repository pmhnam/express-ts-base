import { HTTPException } from './httpException';

export class NotFound extends HTTPException {
  constructor(message = 'Not Found') {
    super(message, 404);
    this.name = 'HTTPNotFoundException';
  }
}

import { Request } from 'express';
import * as yup from 'yup';

export default class AuthValidate {
  static PostRegister = (req: Request) => {
    const schema = yup
      .object({
        email: yup.string().email().required(),
        password: yup.string().required(),
        name: yup.string().required(),
        role: yup.string().required(),
        status: yup.string().required(),
      })
      .noUnknown();
    return schema.validateSync(req.body);
  };
}

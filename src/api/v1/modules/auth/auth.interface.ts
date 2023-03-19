export interface ICreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IQueryOptions {
  paranoid?: boolean;
  deletedBy?: string;
}

export interface IForgotPasswordDto {
  username?: string;
  email?: string;
}

export interface ILoginDto extends IForgotPasswordDto {
  password: string;
}

export interface ICreateUserDto {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
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

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export interface IQueryOptions {
  paranoid?: boolean;
  deletedBy?: string;
}

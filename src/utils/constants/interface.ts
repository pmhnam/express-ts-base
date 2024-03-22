import { Model, ModelStatic } from 'sequelize';

export interface ICoreQueryParams {
  searchFields: string[];
  sortFields: string[];
  filterFields: string[];
  dateScope: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  embed: { [key: string]: { model: ModelStatic<Model<any, any>>; as: string; attributes: string[] } };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, ModelStatic } from 'sequelize';

export interface ICoreQueryParams {
  searchFields: string[];
  sortFields: string[];
  filterFields: string[];
  dateScope: string[];
  embed: { [key: string]: { model: ModelStatic<Model<any, any>>; as: string; attributes: string[] } };
}

export interface ICoreDto {
  search?: string;
  sort?: string;
  page?: string;
  limit?: string;
  offset?: string;
  embed?: string;
  [key: string]: any;
}

export interface IGetPaginationDto {
  limit?: string;
  offset?: string;
  page?: string;
}

export interface IGetSearchQueryDto {
  search: string;
}

export interface IGetSortQueryDto {
  sort: string;
}

export interface IGetEmbedQueryDto {
  embed: string;
}

export interface IMetadata {
  page: number;
  limit?: number;
  totalPages: number;
  totalCount?: number;
  hasNextPage: boolean;
}

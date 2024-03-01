/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICoreDto {
  search?: string;
  sort?: string;
  page?: string;
  limit?: string;
  offset?: string;
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

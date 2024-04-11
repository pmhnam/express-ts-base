import redis from '..';

enum SCHEMA_TYPE {
  TEXT = 'TEXT',
  NUMERIC = 'NUMERIC',
  GEO = 'GEO',
  TAG = 'TAG',
  HISTOGRAM = 'HISTOGRAM',
}
export interface ICreateRedisSearchIndexDto {
  indexKey: string;
  prefix: string;
  schema: { [key: string]: SCHEMA_TYPE };
}

export interface ISearchDto {
  field: string;
  search: string;
}

export async function createRedisSearchIndex(dto: ICreateRedisSearchIndexDto) {
  const commands = [dto.indexKey, 'ON', 'JSON', 'PREFIX', '1', dto.prefix, 'SCHEMA'];
  Object.entries(dto.schema).forEach(([field, value]) => {
    commands.push(`$.${field}`);
    commands.push('AS');
    commands.push(field);
    commands.push(...value.split(' '));
  });

  return await redis.call('FT.CREATE', commands);
}

export async function dropRedisSearchIndex(indexKey: string) {
  return await redis.call('FT.DROPINDEX', indexKey);
}

export async function redisSearch(indexKey: string, dto: ISearchDto | ISearchDto[]) {
  const search = Array.isArray(dto)
    ? dto.map((item) => `@${item.field}:(${item.search})`)
    : [`@${dto.field}:(${dto.search})`];
  const commands = [indexKey, ...search];
  return redis.call('FT.SEARCH', ...commands);
}

export type SearchParams = Record<string, string | string[] | undefined>;

/** One query param as a string; repeated params (?a=1&a=2) use the first value. */
export function getSearchParam(params: SearchParams, key: string): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

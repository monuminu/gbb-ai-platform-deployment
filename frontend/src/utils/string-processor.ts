// ----------------------------------------------------------------------

export function escapeSpecialCharacters(str: string | undefined): string {
  // Escapes all non-alphanumeric characters with a backslash
  if (str === undefined) return '';
  return str.replace(/(['"\\])/g, '\\$1');
}

export function createQueryString(params: Record<string, any>): string {
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `?${queryString}` : '';
}

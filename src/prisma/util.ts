export const constructOrSearch = (query: string | undefined, fields: string[]) => ({
  OR:
    query !== undefined && query.length !== 0
      ? fields.map(field => ({ [field]: { contains: query, mode: "insensitive" as const } }))
      : undefined,
});

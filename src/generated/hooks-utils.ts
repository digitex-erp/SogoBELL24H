// Shared auth hook utilities for generated routes
// Strips non-model query params (like 'token') from where clauses

export function stripInvalidWhereParams(where: Record<string, any>, validFields: string[]): Record<string, any> {
  const cleaned: Record<string, any> = {}
  for (const [key, value] of Object.entries(where)) {
    if (validFields.includes(key) && value !== undefined && value !== null && value !== '') {
      cleaned[key] = value
    }
  }
  return cleaned
}

export function requireAuth(ctx: any) {
  if (!ctx.userId) {
    return { ok: false, error: { code: 'unauthorized', message: 'Authentication required' } }
  }
  return { ok: true }
}

export function autoSetUserId(input: any, ctx: any) {
  return { ok: true, data: { ...input, userId: input.userId || ctx.userId } }
}

export function autoSetOrgId(input: any, ctx: any) {
  return { ok: true, data: { ...input, orgId: input.orgId || ctx.query?.orgId || undefined } }
}

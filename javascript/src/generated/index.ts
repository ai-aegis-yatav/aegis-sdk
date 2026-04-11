/**
 * Auto-generated low-level client surface.
 * Do not edit by hand — regenerate with `bash scripts/codegen.sh`.
 *
 * The human-written `AegisClient` in `../client.ts` wraps this for
 * idiomatic usage; import from here only when you need an endpoint
 * not yet wrapped by the high-level layer.
 */
import createClient from 'openapi-fetch';
import type { paths } from './schema';

export type { paths, components } from './schema';

export function createLowLevelClient(opts: {
  baseUrl: string;
  apiKey?: string;
  bearerToken?: string;
  fetch?: typeof fetch;
}) {
  const headers: Record<string, string> = {};
  if (opts.apiKey) headers['X-API-Key'] = opts.apiKey;
  if (opts.bearerToken) headers['Authorization'] = `Bearer ${opts.bearerToken}`;
  return createClient<paths>({
    baseUrl: opts.baseUrl,
    headers,
    fetch: opts.fetch,
  });
}

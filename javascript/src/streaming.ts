import type { Transport } from "./transport";

export interface SSEEvent {
  data: string;
  event?: string;
  id?: string;
}

export async function* streamSSE(
  transport: Transport,
  method: string,
  path: string,
  body?: unknown,
): AsyncGenerator<SSEEvent> {
  for await (const data of transport.stream({ method, path, body })) {
    yield { data };
  }
}

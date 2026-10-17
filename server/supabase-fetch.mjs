// Bound Supabase requests so an unreachable Auth/DB server cannot leave login spinning forever.
export function createSupabaseFetch(
  fetcher = globalThis.fetch,
  timeoutMs = 10000,
) {
  return (input, init = {}) => {
    const signals = [AbortSignal.timeout(timeoutMs)];
    if (init.signal) signals.push(init.signal);
    if (input instanceof Request) signals.push(input.signal);
    return fetcher(input, { ...init, signal: AbortSignal.any(signals) });
  };
}

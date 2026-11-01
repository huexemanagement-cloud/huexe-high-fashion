import "server-only";

interface KVNamespaceLike {
  get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<any>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: any): Promise<void>;
  delete(key: string): Promise<void>;
}

export async function getKv(): Promise<KVNamespaceLike | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    return (ctx?.env as Record<string, any>)?.HUEXE_KV ?? null;
  } catch {
    return null;
  }
}

export async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const kv = await getKv();
    if (!kv) return null;
    const data = await kv.get(key, "json");
    return (data as T) ?? null;
  } catch (err) {
    console.warn(`[huexe:kv] Read error for "${key}":`, (err as Error)?.message || err);
    return null;
  }
}

export async function kvPut(key: string, value: unknown): Promise<boolean> {
  try {
    const kv = await getKv();
    if (!kv) return false;
    await kv.put(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[huexe:kv] Write error for "${key}":`, (err as Error)?.message || err);
    return false;
  }
}

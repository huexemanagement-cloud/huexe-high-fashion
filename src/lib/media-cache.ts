export type CachedMedia = {
  dataBase64: string;
  mimeType: string;
  filename: string;
};

// Global in-memory cache for media when DB is in local fallback mode
const globalForMedia = globalThis as unknown as { fallbackMediaCache?: Map<string, CachedMedia> };
export const fallbackMediaCache = globalForMedia.fallbackMediaCache ?? new Map<string, CachedMedia>();
if (process.env.NODE_ENV !== "production") globalForMedia.fallbackMediaCache = fallbackMediaCache;


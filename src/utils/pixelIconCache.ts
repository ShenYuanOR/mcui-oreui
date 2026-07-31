const capacity = 128
const cache = new Map<string, string>()

export function getPixelIconCache(key: string): string | undefined {
  const value = cache.get(key)
  if (value === undefined) return undefined
  cache.delete(key)
  cache.set(key, value)
  return value
}

export function setPixelIconCache(key: string, value: string): void {
  cache.delete(key)
  cache.set(key, value)
  while (cache.size > capacity) cache.delete(cache.keys().next().value!)
}

export function clearPixelIconCache(): void {
  cache.clear()
}

export function getPixelIconCacheSize(): number {
  return cache.size
}

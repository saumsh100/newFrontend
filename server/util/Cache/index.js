
export default class Cache {
  constructor(config) {
    this.cache = {};
    this.defaultExpiryMs = config.defaultExpiryMs || 1000;
  }

  get(key, expiry) {
    const exp = expiry || this.defaultExpiryMs;
    const now = Date.now();
    const entry = this.cache[key];
    if (!entry) {
      return null;
    }

    if ((now - entry.fetchedAt) > exp) {
      return null;
    }

    return entry.data;
  }

  set(key, data) {
    this.cache[key] = Cache.createCacheEntry(data);
  }

  static createCacheEntry(data) {
    const now = Date.now();
    return {
      fetchedAt: now,
      data,
    };
  }
}

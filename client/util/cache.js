
'use strict';

/**
 * Class used to cache values for a given period of time.
 */

export default class Cache {
  cache = {};

  defaultExpiryMs = 1000;

  constructor(config = {}) {
    this.defaultExpiryMs = config.defaultExpiryMs || 1000;
  }

  get(key, expiry) {
    const exp = expiry || this.defaultExpiryMs;
    const now = Date.now();
    const entry = this.cache[key];
    return !entry || now - entry.fetchedAt > exp ? null : entry.data;
  }

  set(key, data) {
    this.cache[key] = Cache.createCacheEntry(data);
  }

  static createCacheEntry(data) {
    return {
      fetchedAt: Date.now(),
      data,
    };
  }
}

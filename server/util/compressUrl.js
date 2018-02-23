
import GLOBALS from '../config/globals';
import rebrandly from '../config/rebrandly';

const { shortDomain } = GLOBALS.rebrandly;

/**
 * compressUrl is an async function that uses bitly APIs to compress
 * the link into a shortened one
 *
 * @param longUrl = the url to be compressed
 * @param noFallback = throw error if true and the compression fails, by default we return longUrl
 * @return {Promise.<*>}
 */
export default async function compressUrl(longUrl, noFallback) {
  try {
    const data = await rebrandly.links.create({
      destination: longUrl,
      domain: { fullName: shortDomain },
    });

    return data.shortUrl;
  } catch (err) {
    console.error('Error in compressing the url');
    console.error(err);
    if (noFallback) throw err;
    return longUrl;
  }
}

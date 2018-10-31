
import { host, protocol } from '../server/config/globals';
import compressUrl from '../server/util/compressUrl';

const URL = `${protocol}://${host}/chat`;

async function main() {
  try {
    const shortUrl = await compressUrl(URL);
    console.log(shortUrl);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

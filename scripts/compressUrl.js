
import compressUrl from '../server/util/compressUrl';

const URL = 'https://carecru.io/chat';

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

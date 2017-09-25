
import { computeReviewsAndSend } from '../server/lib/reviews';

async function main() {
  try {
    await computeReviewsAndSend({ date: (new Date().toISOString()) });
    /*const arr = [1, 2, 3];
    for (const i of arr) {
      console.log('before', i);
      await delay(100);
      console.log('after', i);
    }*/

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

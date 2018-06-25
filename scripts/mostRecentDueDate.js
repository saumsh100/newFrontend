
import { mostRecentDueDate } from '../server/lib/dueDate';

async function main() {
  try {
    await mostRecentDueDate({ id: '62954241-3652-4792-bae5-5bfed53d37b7' }, (new Date()).toISOString());
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

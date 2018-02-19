
import { Account, Recall } from '../server/_models';
import { generateDefaultRecalls } from '../server/lib/recalls/default';

const { ACCOUNT_ID } = process.env;

async function main({ accountId }) {
  try {
    const account = await Account.findById(accountId);
    if (!account) {
      throw new Error('Must supply a valid ACCOUNT_ID to this script or else I don\'t know where you want this data to go!');
    }

    const defaultRecalls = generateDefaultRecalls(account);
    await Recall.bulkCreate(defaultRecalls);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main({ accountId: ACCOUNT_ID });

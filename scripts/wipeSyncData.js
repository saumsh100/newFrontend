
import clone from 'lodash/clone';
import Models from '../server/_models';

const ACCOUNT_ID = process.env.ACCOUNT_ID;

if (!ACCOUNT_ID) {
  console.error('No ACCOUNT_ID specified');
  process.exit(1);
}

const ORDER = [
  'Chair',
  'Family',
  'Patient',
  'Service',
  'Practitioner',
  'Appointment',
  'SyncClientError',
];

async function wipeModel(Model, accountId) {
  await Model.destroy({
    where: { accountId },
  });
}

async function wipeAccountData(accountId) {
  const reversedOrder = clone(ORDER).reverse();
  for (const modelName of reversedOrder) {
    await wipeModel(Models[modelName], accountId);
  }
}

async function main() {
  try {
    await wipeAccountData(ACCOUNT_ID);
    console.log(`Wiped account data for ${ACCOUNT_ID}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

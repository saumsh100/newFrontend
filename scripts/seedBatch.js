/**
 * Created by sharp on 2017-06-20.
 */

import faker from 'faker';
import uniqWith from 'lodash/uniqWith';
import { wipeModelSequelize } from '../tests/util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../tests/util/seedTestAccounts';
import { Patient } from '../server/_models';

const patientSeeds = [];
let start = Date.now();

let i;
let length = 1000;
for (i = 0; i < length; i++) {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const phoneNumber = faker.phone.phoneNumber('+1##########');
  patientSeeds.push({
    accountId,
    firstName,
    lastName,
    email: `${firstName}.${lastName}@google.ca`,
    mobilePhoneNumber: phoneNumber,
    birthDate: faker.date.past(),
    gender: 'male',
  });
}

// Throw some errors
const sameEmail = patientSeeds[0].email;
const sameFirst = patientSeeds[0].firstName;
const sameLast = patientSeeds[0].lastName;
console.log('sameEmail', sameEmail);
console.log('sameFirst', sameFirst);
console.log('sameLast', sameLast);
patientSeeds[length - 1].email = sameEmail;
patientSeeds[length - 1].firstName = sameFirst;
patientSeeds[length - 1].lastName = sameLast;

console.log(`Generated Patient Seeds in ${Date.now() - start}ms`);

async function main() {
  try {
    await wipeModelSequelize(Patient);
    await seedTestAccountsSequelize();
    start = Date.now();
    const response = await Patient.batchSave(patientSeeds);
    console.log(response);
    console.log('Successful Batch Saving :)');
    console.log(`Successfully saved ${response.length} patients in ${Date.now() - start}ms`);
    process.exit();
  } catch ({ docs, errors }) {
    console.error('Error Batch Saving :( but still successful');
    console.log('errors length', errors.length);
    console.log(`Successfully saved ${docs.length} patients in ${Date.now() - start}ms`);
    process.exit();
  }
}

//console.log('before');
main();
// console.log('after');

function delay(count) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, count);
  });
}

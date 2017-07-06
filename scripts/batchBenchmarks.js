/**
 * Created by sharp on 2017-06-20.
 */

import { v4 as uuid } from 'uuid';
import faker from 'faker';
import axios from 'axios';
import size from 'lodash/size';
import Patient from '../server/models/Patient';
import uniqWith from 'lodash/uniqWith';
import bindAxiosInterceptors from '../client/util/bindAxiosInterceptors';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkYWUxMzI5Mi03MDk0LTRiMWQtYWExNC1mNDM1MzNjZmI1NjIiLCJzZXNzaW9uSWQiOiI1MmM4MTdlYi1iNmZkLTRmNzctYTU3OC00OWEzNDBjMWVlOGIiLCJhY3RpdmVBY2NvdW50SWQiOiIyYWVhYjAzNS1iNzJjLTRmN2EtYWQ3My0wOTQ2NWNiZjU2NTQiLCJpYXQiOjE0OTkzNjUzMzksImV4cCI6MTUwMTk1NzMzOX0.6_IN2SJDN56EINNoMzmM-iBGEzdzRwBZwmOSna0Jji0';
bindAxiosInterceptors(() => TOKEN);

let start = Date.now();

function generatePatientSeeds(num = 5) {
  const accountId = uuid();
  const patientSeeds = [];
  let i;
  for (i = 0; i < num; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const phoneNumber = faker.phone.phoneNumberFormat(0);
    patientSeeds.push({
      id: uuid(),
      accountId,
      firstName,
      lastName,
      email: `${firstName}.${lastName}@google.ca`,
      mobilePhoneNumber: phoneNumber,
      birthDate: faker.date.past(),
      gender: 'male',
      // isSyncedWithPMS: true,
    });
  }

  return patientSeeds;
}

function makeLastEmailFirst(seeds) {
  const len = seeds.length;
  const last = len - 1;
  const sameEmail = seeds[0].email;
  const sameFirst = seeds[0].firstName;
  const sameLast = seeds[0].lastName;
  seeds[last].email = sameEmail;
  seeds[last].firstName = sameFirst;
  seeds[last].lastName = sameLast;

  console.log('sameEmail', sameEmail);
  console.log('sameFirst', sameFirst);
  console.log('sameLast', sameLast);
}

const patientSeeds = generatePatientSeeds();
makeLastEmailFirst(patientSeeds);

const batchSeeds = generatePatientSeeds();
makeLastEmailFirst(batchSeeds);

console.log(`Generated Patient Seeds in ${Date.now() - start}ms`);

async function main() {
  try {
    const errors = [];
    const docs = [];
    start = Date.now();
    for (const patientSeed of patientSeeds) {
      try {
        const res = await axios.post('http://localhost:5100/api/patients', patientSeed);
        docs.push(res);
      } catch (err) {
        errors.push(err);
      }
    }

    console.log('num patients created =', docs.length);
    console.log('num errors created =', errors.length);
    console.log(`Single Completed in ${Date.now() - start}ms`);

    /*start = Date.now();
    try {
      const res = await axios.post('http://localhost:5100/api/patients/batch', { patients: batchSeeds });
      console.log('num patients created =', size(res.data.entities.patients));
      console.log('num errors created =', 'ZERO');
      console.log(`Batch Completed in ${Date.now() - start}ms`);
    } catch (err) {
      console.log('num patients created =', size(err.data.entities.patients));
      console.log('num errors created =', err.data.errors.length);
      console.log(err.data.errors);
      console.log(`Batch Completed in ${Date.now() - start}ms`);
    }*/

    process.exit();
  } catch (err) {
    console.log('Error Batch Saving :(');
    console.log(err);
    process.exit(err);
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

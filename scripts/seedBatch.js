/**
 * Created by sharp on 2017-06-20.
 */

import { v4 as uuid } from 'uuid';
import faker from 'faker';
import Patient from '../server/models/Patient';

const accountId = uuid();
const patientSeeds = [];
let start = Date.now();

let i;
for (i = 0; i < 10; i++) {
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
  });
}

// Throw some errors
const sameEmail = patientSeeds[0].email;
const sameFirst = patientSeeds[0].firstName;
const sameLast = patientSeeds[0].lastName;
console.log('sameEmail', sameEmail);
console.log('sameFirst', sameFirst);
console.log('sameLast', sameLast);
patientSeeds[9].email = sameEmail;
patientSeeds[9].firstName = sameFirst;
patientSeeds[9].lastName = sameLast;
//patientSeeds[99].id = patientSeeds[0].id;
//patientSeeds[98].id = patientSeeds[0].id;
//patientSeeds[97].id = patientSeeds[0].id;
//patientSeeds[96].id = patientSeeds[0].id;

console.log(`Generated Patient Seeds in ${Date.now() - start}ms`);

start = Date.now();
async function main() {
  try {
    const errors = [];
    const docs = [];
    for (const patientSeed of patientSeeds) {
      try {
        let patient = new Patient(patientSeed);
        patient = Patient.sanitize(patient);
        patient = await Patient.uniqueValidate.call(patient, (err) => {
          console.log('Finished Unique Validate:', err ? 'error' : 'success');
          if (err) throw err;
          docs.push(patient);
        });

        console.log('On to the next one...');
      } catch (err) {
        console.log(err);
        errors.push(err);
      }
    }

    console.log(docs.length);
    console.log(errors.length);


    const patients = await Patient.batchInsert(docs);
    console.log(patients);
    console.log('Successful Batch Saving :)');
    console.log(`Successfully saved ${patients.length} patients in ${Date.now() - start}ms`);

    /*const patient = new Patient({
      accountId,
      firstName: 'Justin',
      lastName: 'Sharpsterzzz',
      email: `asd`,
      mobilePhoneNumber: '+1780 850 8886',
      // birthDate: faker.date.past(),
      // gender: 'male',
    });

    console.log('Emitting Save');
    // const docOnPatient = await patient.emit('saving', patient);
    console.log(patient);
    console.log(Patient._pre.save);
    console.log('Save Emitted');*/

    process.exit();
  } catch (err) {
    console.log('Error Batch Saving :(');
    console.log(err);
    process.exit(err);
  }
  /*console.log(0);
  await delay(1000);
  console.log(1);
  await delay(1000);
  console.log(2);
  //const patient  = new Patient(patientSeeds[0]);
  //patient.validate();*/

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

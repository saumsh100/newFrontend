
import { Patient } from '../../server/_models';
import wipeModel from './wipeModel';
import { accountId } from './seedTestUsers';

const patientId1 = '10518e11-b9d2-4d74-9887-29eaae7b5938';
const patientId2 = '20518e11-b9d2-4d74-9887-29eaae7b5938';
const patientId3 = '30518e11-b9d2-4d74-9887-29eaae7b5938';

const patient1 = {
  id: patientId1,
  accountId,
  email: 'testpatient1@test.com',
  firstName: 'Ronald',
  lastName: 'Mcdonald',
  mobilePhoneNumber: '+17789999999',
  homePhoneNumber: '+17789999999',
  workPhoneNumber: '+17789999999',
  otherPhoneNumber: '+17789999999',
  createdAt: '2017-07-19T00:14:30.932Z',
  birthDate: '1990-01-01T00:00:00.932Z',
  appointmentPreference: 'both',
};

const patient2 = {
  id: patientId2,
  accountId,
  email: 'testpatient2@test.com',
  firstName: 'James',
  lastName: 'Mcdonald',
  mobilePhoneNumber: '+17789999990',
  homePhoneNumber: '+17789999990',
  workPhoneNumber: '+17789999990',
  otherPhoneNumber: '+17789999990',
  createdAt: '2017-07-19T00:14:30.932Z',
  birthDate: '2005-01-01T00:00:00.932Z',
  appointmentPreference: 'both',
};

const patient3 = {
  id: patientId3,
  accountId,
  email: 'testpatient3@test.com',
  firstName: 'Jason',
  lastName: 'Mcdonald',
  mobilePhoneNumber: '+17789999991',
  homePhoneNumber: '+17789999991',
  workPhoneNumber: '+17789999991',
  otherPhoneNumber: '+17789999991',
  createdAt: '2017-07-19T00:14:30.932Z',
  birthDate: '2010-01-01T00:00:00.932Z',
  appointmentPreference: 'both',
};

async function seedTestPatientsList() {
  await wipeModel(Patient);
  await Patient.bulkCreate([
    patient1,
    patient2,
    patient3,
  ]);
}

async function wipeTestPatients() {
  await wipeModel(Patient);
}

module.exports = {
  patient1,
  patient2,
  patient3,
  patientId1,
  patientId2,
  patientId3,
  seedTestPatientsList,
  wipeTestPatients,
};

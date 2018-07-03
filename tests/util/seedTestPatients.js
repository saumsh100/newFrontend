
import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../../server/config/globals';
import { Patient, PatientUser, Family } from '../../server/_models';
import wipeModel from './wipeModel';
import { accountId } from './seedTestUsers';

const patientId = '10518e11-b9d2-4d74-9887-29eaae7b5938';
const patientUserId = 'b8665c97-1e98-41ac-bf13-090b742de400';
const familyId = 'b35bee92-e86d-4084-87d8-add21a1ba0f6';

const patient = {
  id: patientId,
  accountId,
  email: 'testpatient@test.com',
  firstName: 'Ronald',
  lastName: 'Mcdonald',
  pmsId: '12',
  mobilePhoneNumber: '7789999999',
  createdAt: '2017-07-19T00:14:30.932Z',
  address: null,
  birthDate: '1980-01-01T00:00:00.932Z',
  familyId,
  gender: null,
  homePhoneNumber: null,
  language: null,
  middleName: null,
  otherPhoneNumber: null,
  patientUserId: null,
  phoneNumber: null,
  prefName: null,
  prefPhoneNumber: null,
  type: null,
  workPhoneNumber: null,
  firstApptId: null,
  lastApptId: null,
  nextApptId: null,
  appointmentPreference: 'both',
  // avatarUrl: '',
  // pmsId: 0,
  //pmsId: null,
  /*
   middleName: '',

   phoneNumber: '60494949494',
   homePhoneNumber: '6049899090',
   mobilePhoneNumber: '7789393090',
   workPhoneNumber: '6043854341',
   otherPhoneNumber: '6048989213',
   prefContactPhone: '',
   patientUserId: '',
   */

};

const patientUser = {
  id: patientUserId,
  firstName: 'Jack',
  lastName: 'Daniels',
  email: 'testpatientuser@test.com',
  phoneNumber: '+16049999999',
  birthDate: '1996-07-19T00:14:30.932Z',
  password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
  createdAt: '2017-07-19T00:14:30.932Z',
};

const family = {
  id: familyId,
  accountId,
  pmsId: '12',
  headId: '12',
};

async function seedTestPatients() {
  await wipeModel(PatientUser);
  await wipeModel(Patient);
  await wipeModel(Family);

  await Family.create(family);
  await PatientUser.create(patientUser);
  await Patient.create(patient);
}

async function wipeTestPatients() {
  await wipeModel(PatientUser);
  await wipeModel(Patient);
  await wipeModel(Family);
}

module.exports = {
  patient,
  patientUser,
  family,
  patientId,
  patientUserId,
  familyId,
  seedTestPatients,
  wipeTestPatients,
};

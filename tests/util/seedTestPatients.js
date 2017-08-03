
import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../../server/config/globals';
import { Patient, PatientUser } from '../../server/models';
import { Patient as _Patient, PatientUser as _PatientUser } from '../../server/_models';
import wipeModel, { wipeModelSequelize } from './wipeModel';
import { accountId } from './seedTestUsers';

const patientId = '10518e11-b9d2-4d74-9887-29eaae7b5938';
const patientUserId = 'b8665c97-1e98-41ac-bf13-090b742de400';

const patient = {
  id: patientId,
  accountId,
  email: 'testpatient@test.com',
  firstName: 'Ronald',
  lastName: 'Mcdonald',
  pmsId: null,
  mobilePhoneNumber: '7789999999',
  createdAt: '2017-07-19T00:14:30.932Z',
  address: null,
  birthDate: null,
  familyId: null,
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
  password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestPatients() {
  await wipeModel(PatientUser);
  await wipeModel(Patient);

  await PatientUser.save(patientUser);
  await Patient.save(patient);
}

async function seedTestPatientsSequelize() {
  await wipeModelSequelize(_PatientUser);
  await wipeModelSequelize(_Patient);

  await _PatientUser.create(patientUser);
  await _Patient.create(patient);
}

module.exports = {
  patient,
  patientUser,
  patientId,
  patientUserId,
  seedTestPatients,
  seedTestPatientsSequelize,
};

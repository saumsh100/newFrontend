
import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../../server/config/globals';
import { Patient, PatientUser } from '../../server/models';
import wipeModel from './wipeModel';
import { accountId } from './seedTestUsers';

const patientId = '10518e11-b9d2-4d74-9887-29eaae7b5938';
const patientUserId = 'b8665c97-1e98-41ac-bf13-090b742de400';

const patient = {
  id: patientId,
  accountId,
  avatarUrl: '',
  email: 'testPatient@test.com',
  pmsId: 0,
  firstName: 'Ronald',
  lastName: 'Mcdonald',
  pmsId: null,
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
  email: 'testPatientUser@test.com',
  phoneNumber: '6049999999',
  password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
};

async function seedTestPatients() {
  await wipeModel(PatientUser);
  await wipeModel(Patient);

  await PatientUser.save(patientUser);
  await Patient.save(patient);
}

module.exports = {
  patientId,
  patientUserId,
  seedTestPatients,
};

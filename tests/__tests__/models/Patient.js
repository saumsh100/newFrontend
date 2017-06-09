import { v4 as uuid } from 'uuid';
import { omit } from 'lodash';
import Patient from '../../../server/models/Patient';
import thinky from '../../../server/config/thinky';

const type = thinky.type;

const CARECRU = 'carecru';
const NOT_CARECRU = 'not_carecru';
const PATIENT_TEST_TABLE_NAME = 'PatientTest';

const accountId = 'dc9bd17e-7152-4dbf-9c28-18b1bf5eb30d';
let patientId = '';
let patientDoc = {};
let patientDoc2 = false;

let testPatient1 = {};

describe('Simple patients write test', () => {

  beforeEach(() => {
    testPatient1 = {
      firstName: 'John',
      lastName: 'Doe',
      mobilePhoneNumber: '1112223344',
      homePhoneNumber: '9998887766',
      accountId,
    };
  });

  afterEach(() => {
    console.log('afterEach: removing test patient: ', patientId);
    return patientDoc.deleteAll().then(() => {
      const PatientMobilePhoneNumber = Patient.auxModels['mobilePhoneNumber'];
      return PatientMobilePhoneNumber.get([patientDoc.mobilePhoneNumber, patientDoc.accountId])
        .delete()
        .catch((error) => {
          if (error.name === 'ValidationError') {
            console.log('all good, this still means the test should pass.');
          }
        });
    });
  });

  afterEach(() => {
    if (patientDoc2) {
      return patientDoc2.deleteAll();
    }
  });

  /**
   * - write single patient
   */
  test('Single patient write test', () => {
    console.log('creating testPatient1', testPatient1);
    return Patient.save(testPatient1)
      .then((result) => {
        patientId = result.id;
        patientDoc = result;
        console.log('test: result', result);
        expect(result.firstName).toBe(testPatient1.firstName);
        expect(result.id).toBe(patientId);
      });
  });

  /**
   * - write patient1
   * - write patient2 with the same phone number
   */
  test('Write two patients with same phone number', () => {
    console.log('creating testPatient1', testPatient1);

    // write first patient and check it and its aux table doc
    return Patient.save(testPatient1)
      .then((result) => {
        patientId = result.id;
        patientDoc = result;
        expect(result.firstName).toBe(testPatient1.firstName);
        expect(result.mobilePhoneNumber).toBe(testPatient1.mobilePhoneNumber);

        return Patient.auxModels.mobilePhoneNumber
          .get([patientDoc.mobilePhoneNumber, patientDoc.accountId])
          .then((patient1AuxDoc) => {
            expect(patient1AuxDoc.id).toBe(result.id);

            // write the second patient with the same mobile phone number
            const testPatient2 = omit(testPatient1, 'id');

            return Patient.save(testPatient2)
              .then((result2) => {
                throw new Error('Should not have been able to write this patient AGAIN.', testPatient2);
              })
              .catch((err) => {
                expect(err.message).toBe('Unique Field Validation Error');
              });
          });
      });
  });

  /**
   * - write patient1
   * - write patient2 with the same phone number
   */
  test('Write two patients with same phone number', () => {
    console.log('creating testPatient1', testPatient1);

    // write first patient and check it and its aux table doc
    return Patient.save(testPatient1)
      .then((result) => {
        patientId = result.id;
        patientDoc = result;
        expect(result.firstName).toBe(testPatient1.firstName);
        expect(result.mobilePhoneNumber).toBe(testPatient1.mobilePhoneNumber);

        return Patient.auxModels.mobilePhoneNumber
          .get([patientDoc.mobilePhoneNumber, patientDoc.accountId])
          .then((patient1AuxDoc) => {
            expect(patient1AuxDoc.id).toBe(result.id);

            // write the second patient with the same mobile phone number
            const testPatient2 = omit(testPatient1, 'id');

            return Patient.save(testPatient2)
              .then((result2) => {
                throw new Error('Should not have been able to write this patient AGAIN.', testPatient2);
              })
              .catch((err) => {
                expect(err.message).toBe('Unique Field Validation Error');
              });
          });
      });
  });
});

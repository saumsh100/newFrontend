import { v4 as uuid } from 'uuid';
import { omit } from 'lodash';
import Patient from '../../../server/models/Patient';
import thinky from '../../../server/config/thinky';

const type = thinky.type;

const CARECRU = 'carecru';
const NOT_CARECRU = 'not_carecru';
const PATIENT_TEST_TABLE_NAME = 'PatientTest';

const accountId = 'dc9bd17e-7152-4dbf-9c28-18b1bf5eb30d';
let patientIdGlobal = '';
let patientDocGlobal = {};
let patientDocGlobal2 = false;

let testPatientObject1 = {};
let testPatientObject2 = {};

describe('Simple patients write test', () => {

  beforeEach(() => {
    testPatientObject1 = {
      firstName: 'Han',
      lastName: 'Solo',
      mobilePhoneNumber: '1112223344',
      homePhoneNumber: '9998887766',
      accountId,
    };
    testPatientObject2 = {
      firstName: 'Master',
      lastName: 'Yoda',
      mobilePhoneNumber: '5550001122',
      homePhoneNumber: '4440001122',
      accountId,
    };
  });

  afterEach(() => {
    console.log('afterEach: removing test patient: ', patientDocGlobal.id);
    return patientDocGlobal.deleteAll().then(() => {
      const PatientMobilePhoneNumber = Patient.auxModels['mobilePhoneNumber'];
      return PatientMobilePhoneNumber
        .delete()
        .then(() => {
          console.log('All cleaned up.');
        })
        .catch((error) => {
          if (error.name === 'ValidationError') {
            console.log('all good, this still means the test should pass.');
          }
        });
    });
  });

  afterEach(() => {
    if (patientDocGlobal2) {
      return patientDocGlobal2.deleteAll();
    }
  });

  /**
   * - write single patient
   */
  test('Single patient write test and check its aux model', () => {
    console.log('creating testPatientObject1', testPatientObject1);
    return Patient.save(testPatientObject1)
      .then((result) => {
        patientIdGlobal = result.id;
        patientDocGlobal = result;
        console.log('test: result', result);
        expect(result.firstName).toBe(testPatientObject1.firstName);
        expect(result.id).toBe(patientIdGlobal);

        return Patient.auxModels.mobilePhoneNumber
          .get([patientDocGlobal.mobilePhoneNumber, patientDocGlobal.accountId])
          .then((patient1AuxDoc) => {
            expect(patient1AuxDoc.id).toBe(result.id);
            expect(patient1AuxDoc['mobilePhoneNumber.accountId'])
              .toEqual(expect.arrayContaining([result.mobilePhoneNumber, result.accountId]));
          });
      });
  });

  /**
   * - write patient1
   * - write patient2 with the same phone number
   */
  test('Write two patients with same phone number', () => {
    console.log('creating testPatientObject1', testPatientObject1);

    // write first patient and check it and its aux table doc
    return Patient.save(testPatientObject1)
      .then((result) => {
        patientIdGlobal = result.id;
        patientDocGlobal = result;
        expect(result.firstName).toBe(testPatientObject1.firstName);
        expect(result.mobilePhoneNumber).toBe(testPatientObject1.mobilePhoneNumber);

        return Patient.auxModels.mobilePhoneNumber
          .get([patientDocGlobal.mobilePhoneNumber, patientDocGlobal.accountId])
          .then((patient1AuxDoc) => {
            expect(patient1AuxDoc.id).toBe(result.id);

            // write the second patient with the same mobile phone number
            const testPatient2 = omit(testPatientObject1, 'id');

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
   * Testing whether Aux table is updated correctly when a value of the key changes.
   * - write patient1
   * - change phone number of patient 1
   * - change phone number of patient 1 back to original
   */
  test('Create patient, change phone number to diff, change back to the same again.', () => {
    // write patient and check it and its aux table doc
    return Patient.save(testPatientObject1)
      .then((firstSaveResult) => {
        patientIdGlobal = firstSaveResult.id;
        patientDocGlobal = firstSaveResult;

        expect(firstSaveResult.firstName).toBe(testPatientObject1.firstName);
        expect(firstSaveResult.mobilePhoneNumber).toBe(testPatientObject1.mobilePhoneNumber);

        // change mobile phone number of the doc to a new value and persist it
        return Patient.get(firstSaveResult.id)
          .then((doc1) => {
            return doc1.merge({ mobilePhoneNumber: '7780001122' })
              .save()
              .then((secondSaveResult) => {
                expect(secondSaveResult.mobilePhoneNumber).toBe('7780001122');
                expect(secondSaveResult.firstName).toBe(firstSaveResult.firstName);
                expect(secondSaveResult.lastName).toBe(firstSaveResult.lastName);

                // change the phone number back to original and persist it
                return Patient.get(secondSaveResult.id)
                  .then((doc2) => {
                    return doc2.merge({ mobilePhoneNumber: patientDocGlobal.mobilePhoneNumber })
                      .save()
                      .then((thirdSaveResult) => {
                        expect(thirdSaveResult.mobilePhoneNumber).toBe(firstSaveResult.mobilePhoneNumber);
                        expect(thirdSaveResult.firstName).toBe(firstSaveResult.firstName);
                        expect(thirdSaveResult.lastName).toBe(firstSaveResult.lastName);
                      });
                  });
              });
          });
      });
  });

  /**
   * - create two patients with different phone numbres
   * - update one patient with the phone number of another - should now allow that and throw Error
   */
  test('Create two patients, update phone number with existing number', () => {
    return Patient.save([testPatientObject1, testPatientObject2])
      .then((result) => {
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        patientDocGlobal = result[0];
        patientDocGlobal2 = result[1];

        // update one of the patients to the phone number of another patient
        return Patient.get(patientDocGlobal.id)
          .then((persistedDoc) => {
            // update patient 1 with the phone number of patient 2
            return persistedDoc.merge({ mobilePhoneNumber: patientDocGlobal2.mobilePhoneNumber })
              .save()
              .then(() => {
                throw Error('Should not happen.');
              })
              .catch((err) => {
                expect(err.message).toBe('Unique Field Validation Error');
              });
          });
      });
  });

  /**
   * - batch create two docs with the same phone number write away
   */
  test.skip('batch create two docs with the same phone number write away', () => {
    Object.assign(testPatientObject2, { mobilePhoneNumber: testPatientObject1.mobilePhoneNumber });
    console.log('modified testPatientObject2', testPatientObject2);
    return Patient.save([testPatientObject1, testPatientObject2])
      .then(() => {
        throw Error('Should not happen');
      })
      .catch((err) => {
        expect(err.message).toBe('Unique Field Validation Error');
      });
  });
});

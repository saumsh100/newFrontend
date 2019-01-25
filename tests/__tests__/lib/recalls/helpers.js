
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { w2s } from '@carecru/isomorphic';
import {
  Appointment,
  Family,
  Patient,
  Practitioner,
  Recall,
  SentRecall,
} from 'CareCruModels';
import {
  mapPatientsToRecalls,
  getRecallsOutboxList,
  getPatientsDueForRecall,
  shouldSendRecall,
  removeRecallDuplicates,
  getPatientsForRecallTouchPoint,
} from '../../../../server/lib/recalls/helpers';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';

// TODO: make seeds more modular so we can see here
// const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
// const patientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const oneDayReminderId = '8aeab035-b72c-4f7a-ad73-09465cbf5654';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => ({
  accountId,
  ...data,
});

const makeSentRecallData = (data = {}) => Object.assign({
  // Doesnt even have to match recall for this test
  patientId,
  accountId,
  lengthSeconds: w2s(-1),
  primaryType: 'email',
}, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => ({
  startDate: date(y, m, d, h),
  endDate: date(y, m, d, h + 1),
});

describe('Recalls Calculation Library', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  afterEach(async () => {
    await wipeAllModels();
  });

  describe('Helpers', () => {
    describe('#mapPatientsToRecalls', () => {
      let patients;
      let families;
      beforeEach(async () => {
        const familyId = uuid();
        patients = await Patient.bulkCreate([
          makePatientData({
            firstName: 'Old',
            lastName: 'Patient',
            status: 'Active',
            email: 'test@test.com',
            dueForHygieneDate: date(2017, 1, 5, 9),
            lastHygieneDate: date(2016, 1, 5, 9),
          }),

          makePatientData({
            firstName: 'Other',
            lastName: 'Patient',
            status: 'Active',
            email: 'test@test.com',
          }),
        ]);

        families = await Family.bulkCreate([
          {
            id: familyId,
            headId: patients[0].id,
            accountId,
          },
        ]);

        await patients[0].update({ familyId: families[0].id });
        await patients[1].update({ familyId: families[0].id });
      });

      test('should be a function', () => {
        expect(typeof mapPatientsToRecalls).toBe('function');
      });

      test('shold not send recalls if the due date is before last date', async () => {
        patients = await Patient.bulkCreate([
          makePatientData({
            firstName: 'Old',
            lastName: 'Patient',
            status: 'Active',
            email: 'test1@test.com',
            dueForHygieneDate: date(2016, 1, 5, 9),
            lastHygieneDate: date(2017, 1, 5, 9),
          }),
        ]);

        const [
          oneMonthRecalls,
          twoMonthRecalls,
        ] = await mapPatientsToRecalls({
          recalls: [
            {
              interval: '1 months',
              primaryTypes: ['email'],
            },
            {
              interval: '2 months',
              primaryTypes: ['email'],
            },
          ],

          account: {
            id: accountId,
            recallBuffer: '1 days',
          },

          startDate: date(2016, 10, 5, 8),
          endDate: date(2018, 10, 5, 8),
        });

        expect(oneMonthRecalls.success).toHaveLength(1);
        expect(twoMonthRecalls.success).toHaveLength(0);
      });

      test('make sure with multiple recalls that are valid. Only the most recent returns', async () => {
        const result = await mapPatientsToRecalls({
          recalls: [
            {
              interval: '1 months',
              primaryTypes: ['email'],
            },
            {
              interval: '2 months',
              primaryTypes: ['email'],
            },
          ],

          account: {
            id: accountId,
            recallBuffer: '1 days',
          },

          startDate: date(2016, 10, 5, 8),
          endDate: date(2018, 10, 5, 8),
        });

        const [
          oneMonthRecalls,
          twoMonthRecalls,
        ] = result;

        expect(oneMonthRecalls.success.length).toBe(1);
        expect(twoMonthRecalls.success.length).toBe(0);
      });

      test('dont send to non contact info PoCs', async () => {
        await families[0].update({ headId: patients[1].id  });
        const result = await mapPatientsToRecalls({
          recalls: [
            {
              interval: '1 months',
              primaryTypes: ['email'],
            },
            {
              interval: '2 months',
              primaryTypes: ['email'],
            },
          ],

          account: {
            id: accountId,
            recallBuffer: '1 days',
          },

          startDate: date(2016, 10, 5, 8),
          endDate: date(2018, 10, 5, 8),
        });

        const [
          oneMonthRecalls,
          twoMonthRecalls,
        ] = result;

        expect(oneMonthRecalls.success.length).toBe(0);
        expect(oneMonthRecalls.errors.length).toBe(0);
        expect(twoMonthRecalls.success.length).toBe(0);
      });

      test('should not return the patient cause the omitRecallIds is populate', async () => {
        const recallId = uuid();
        await patients[0].update({ omitRecallIds: [recallId] });
        const result = await mapPatientsToRecalls({
          recalls: [{
            id: recallId,
            interval: '1 months',
            primaryTypes: ['email'],
          }],

          account: {
            id: accountId,
            recallBuffer: '1 days',
          },

          startDate: date(2016, 10, 5, 8),
          endDate: date(2018, 10, 5, 8),
        });

        const [
          oneMonthRecalls,
        ] = result;

        expect(oneMonthRecalls.success.length).toBe(0);
      });
    });

    describe('#getRecallsOutboxList - formatting', () => {
      let recalls;
      let patients;
      let appointments;
      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryTypes: ['email'],
            interval: '1 months',
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({
            firstName: 'John',
            lastName: 'Denver',
            email: 'hello1@hello.com',
            status: 'Active',
            dueForHygieneDate: date(2018, 3, 1, 8),
            lastHygieneDate: date(2017, 3, 1, 8),
          }),

          makePatientData({
            firstName: 'Carol',
            email: 'hello2@hello.com',
            lastName: 'Heine',
            status: 'Active',
            dueForHygieneDate: date(2018, 3, 2, 8),
            lastHygieneDate: date(2017, 3, 1, 8),
          }),

          makePatientData({
            firstName: 'Beth',
            email: 'hello3@hello.com',
            lastName: 'Berth',
            status: 'Active',
            dueForHygieneDate: date(2018, 3, 2, 17),
            lastHygieneDate: date(2017, 3, 1, 8),
          }),

          makePatientData({
            firstName: 'Herbie',
            email: 'hello4@hello.com',
            lastName: 'Hancock',
            status: 'Active',
            dueForHygieneDate: date(2018, 3, 3, 18),
            lastHygieneDate: date(2017, 3, 1, 8),
          }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({
            patientId: patients[0].id,
            ...dates(2016, 7, 5, 9),
          }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test('check to see if getRecallsOutboxList returns the right order and format', async () => {
        let result = await getRecallsOutboxList({
          account: {
            id: accountId,
            recallBuffer: '1 days',
            recallStartTime: '17:00:00',
            timezone: 'America/Vancouver',
          },

          startDate: date(2018, 2, 2, 7),
          endDate: date(2018, 2, 8, 8),
        });

        expect(result.length).toBe(4);

        result = result.sort((a, b) => moment(a.dueForHygieneDate).isAfter(b.dueForHygieneDate));

        expect(result[0].primaryTypes[0]).toBe('email');
        expect(result[1].primaryTypes[0]).toBe('email');
        expect(result[2].primaryTypes[0]).toBe('email');
        expect(result[3].primaryTypes[0]).toBe('email');
      });
    });

    describe('#getRecallsOutboxList', () => {
      let recalls;
      let patients;
      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryTypes: ['email'],
            interval: '1 months',
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({
            firstName: 'Old',
            mail: 'hello@hello.com',
            lastName: 'Patient',
            status: 'Active',
            dueForHygieneDate: date(2017, 1, 5, 9),
          }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      // Since account doesn't have a timezone defaults to server time or PST, so sendDate should be
      // at 5 pm PST
      test.skip('should return 1 - with sendDate running at 5 pm PST when no timezone', async () => {
        const result = await getRecallsOutboxList({
          account: {
            id: accountId,
            recallBuffer: '1 days',
            recallStartTime: '17:00:00',
            timezone: 'America/Vancouver',
          },

          startDate: date(2016, 0, 1, 9),
          endDate: date(2017, 8, 8, 9),
        });

        expect(result.length).toBe(1);
        expect(result[0].patient.firstName).toBe('Old');
        expect(result[0].patient.lastName).toBe('Patient');
        expect(result[0].sendDate).toBe(date(2017, 0, 5, 17));
      });

      // Since account has a new york a timezone dit should be 2pm PST as that's 5pm ESt
      test.skip('should return 1 - with sendDate runing at 2 pm PST when time zone is New York', async () => {
        const result = await getRecallsOutboxList({
          account: {
            id: accountId,
            hygieneInterval: '10 months',
            recallInterval: '10 months',
            timezone: 'America/New_York',
            recallBuffer: '1 days',
            recallStartTime: '17:00:00',
          },
          startDate: date(2016, 0, 1, 9),
          endDate: date(2017, 8, 8, 9),
        });

        expect(result.length).toBe(1);
        expect(result[0].patient.firstName).toBe('Old');
        expect(result[0].patient.lastName).toBe('Patient');
        expect(result[0].sendDate).toBe('2017-01-05T22:00:00.000Z');
      });
    });

    describe('#shouldSendRecall', () => {
      test('should be a function', () => {
        expect(typeof shouldSendRecall).toBe('function');
      });

      test('should return none as they have sent recalls', async () => {
        const result = shouldSendRecall([{ sentRecalls: [{}] }]);

        expect(result.length).toBe(0);
      });

      test('should return 1 as they have no recalls', async () => {
        const result = shouldSendRecall([{ sentRecalls: [] }]);

        expect(result.length).toBe(1);
      });
    });

    describe('#removeRecallDuplicates', () => {
      test('should be a function', () => {
        expect(typeof removeRecallDuplicates).toBe('function');
      });

      test('should return one with duplicates with it being hygiene', async () => {
        const patient1 = { get: () => ({ id: '5' }) };

        const result = removeRecallDuplicates([patient1], [patient1]);

        expect(result.length).toBe(1);
        expect(result[0].hygiene).toBe(true);
      });

      test('should return two with duplicates with one hygiene and one recall that are unique patients', async () => {
        const patient1 = {
          get: () => {
            return { id: '5' };
          },
        };

        const patient2 = {
          get: () => {
            return { id: '7' };
          },
        };

        const result = removeRecallDuplicates([patient1], [patient2]);

        expect(result.length).toBe(2);
        expect(result[0].hygiene).toBe(true);
        expect(result[1].hygiene).toBe(false);
      });
    });

    describe('#removeRecallDuplicates', () => {
      test('should be a function', () => {
        expect(typeof removeRecallDuplicates).toBe('function');
      });

      test('should return one with duplicates with it being hygiene', async () => {
        const patient1 = {
          get: () => {
            return { id: '5' };
          },
        };

        const result = removeRecallDuplicates([patient1], [patient1]);

        expect(result.length).toBe(1);
        expect(result[0].hygiene).toBe(true);
      });

      test('should return two with duplicates with one hygiene and one recall that are unique patients', async () => {
        const patient1 = { get: () => ({ id: '5' }) };
        const patient2 = { get: () => ({ id: '7' }) };
        const result = removeRecallDuplicates([patient1], [patient2]);

        expect(result.length).toBe(2);
        expect(result[0].hygiene).toBe(true);
        expect(result[1].hygiene).toBe(false);
      });
    });
  });
});


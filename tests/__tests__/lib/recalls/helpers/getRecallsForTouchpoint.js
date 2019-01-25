
import moment from 'moment';
import { w2s } from '@carecru/isomorphic';
import {
  Appointment,
  Patient,
  Practitioner,
  Recall,
  SentRecall,
} from '../../../../../server/_models';
import { getPatientsForRecallTouchPoint } from '../../../../../server/lib/recalls/helpers';
import { wipeAllModels } from '../../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../../util/seedTestPractitioners';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatData = (data = {}) => Object.assign({
  accountId,
  status: 'Active',
}, data);

const makeSentRecallData = (data = {}) => Object.assign({
  // Doesnt even have to match recall for this test
  patientId,
  accountId,
  lengthSeconds: w2s(-1),
  primaryType: 'email',
}, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => {
  return {
    startDate: date(y, m, d, h),
    endDate: date(y, m, d, h + 1),
  };
};

describe('#getPatientsForRecallTouchpoint', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  test('should be a function', () => {
    expect(typeof getPatientsForRecallTouchPoint).toBe('function');
  });

  describe('null dueDates', () => {
    let patients;
    beforeEach(async () => {
      patients = await Patient.bulkCreate([
        makePatData({ firstName: 'A', lastName: 'B' }),
        makePatData({ firstName: 'C', lastName: 'D' }),
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('should return 0 patients because all dueDates are null', async () => {
      const result = await getPatientsForRecallTouchPoint({
        recall: { interval: '1 months' },
        account: {
          id: accountId,
          recallBuffer: '1 days',
        },

        startDate: date(2018, 3, 3, 8),
      });

      expect(result.length).toBe(0);
    });
  });

  describe('dueForHygieneDate', () => {
    let patients;
    beforeEach(async () => {
      patients = await Patient.bulkCreate([
        makePatData({ firstName: 'A', lastName: 'B' }),
        makePatData({ firstName: 'C', lastName: 'D' }),
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('Should return 1 patient that is dueForHygiene in 1 month', async () => {
      await patients[0].update({ dueForHygieneDate: date(2017, 1, 5, 7), lastHygieneDate: date(2016, 1, 5, 7) });
      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },

        account: {
          id: accountId,
          recallBuffer: '1 days',
        },

        // Pay attention that this is 1 hour after the dueDate hour
        // We don't include end bound
        startDate: date(2017, 0, 5, 8),
      });

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(patients[0].id);
    });

    test('Should return 0 patients that are dueForHygiene in 1 month cause its endDate is on the end bound', async () => {
      await patients[0].update({ dueForHygieneDate: date(2017, 1, 5, 7), lastHygieneDate: date(2016, 1, 5, 7) });
      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },

        account: {
          id: accountId,
          recallBuffer: '1 days',
        },

        // Pay attention that this is 1 hour after the dueDate hour
        // We don't include end bound
        startDate: date(2017, 0, 5, 7),
      });

      expect(result.length).toBe(0);
    });

    test('Should return a patient for a negative interval', async () => {
      await patients[0].update({ dueForHygieneDate: date(2017, 1, 5, 7), lastHygieneDate: date(2016, 1, 5, 7) });
      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '-1 months',
        },

        account: {
          id: accountId,
          recallBuffer: '1 days',
        },

        // Pay attention that this is 1 hour after the dueDate hour
        // We don't include end bound
        startDate: date(2017, 2, 5, 8),
      });

      expect(result.length).toBe(1);
    });
  });

  describe('dueForRecallExamDate', () => {
    let patients;
    beforeEach(async () => {
      patients = await Patient.bulkCreate([
        makePatData({ firstName: 'A', lastName: 'B' }),
        makePatData({ firstName: 'C', lastName: 'D' }),
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('Should return 1 patient that is dueForRecallExamDate in 1 month', async () => {
      await patients[0].update({ dueForRecallExamDate: date(2017, 1, 5, 7), lastRecallDate: date(2016, 1, 5, 7) });
      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },

        account: {
          id: accountId,
          recallBuffer: '1 days',
        },

        // Pay attention that this is 1 hour after the dueDate hour
        // We don't include end bound
        startDate: date(2017, 0, 5, 8),
      });

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(patients[0].id);
    });

    test('Should return 0 patients that are dueForRecallExamDate in 1 month cause its endDate is on the end bound', async () => {
      await patients[0].update({ dueForRecallExamDate: date(2017, 1, 5, 7), lastRecallDate: date(2016, 1, 5, 7) });
      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },

        account: {
          id: accountId,
          recallBuffer: '1 days',
        },

        // Pay attention that this is 1 hour after the dueDate hour
        // We don't include end bound
        startDate: date(2017, 0, 5, 7),
      });

      expect(result.length).toBe(0);
    });

    test('Should return a patient for a negative interval', async () => {
      await patients[0].update({ dueForRecallExamDate: date(2017, 1, 5, 7), lastRecallDate: date(2016, 1, 5, 7) });
      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '-1 months',
        },

        account: {
          id: accountId,
          recallBuffer: '1 days',
        },

        // Pay attention that this is 1 hour after the dueDate hour
        // We don't include end bound
        startDate: date(2017, 2, 5, 8),
      });

      expect(result.length).toBe(1);
    });
  });

  describe('Patient Preferences', () => {
    let patients;
    beforeEach(async () => {
      patients = await Patient.bulkCreate([
        makePatData({ firstName: 'A', lastName: 'B' }),
        makePatData({ firstName: 'C', lastName: 'D' }),
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('Should return 0 patienta cause the patient that is due has recalls turned off', async () => {
      await patients[0].update({
        dueForRecallExamDate: date(2017, 1, 5, 7),
        lastHygieneDate: date(2016, 1, 5, 7),
        preferences: { recalls: false },
      });

      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },

        account: {
          id: accountId,
          recallBuffer: '1 days',
        },

        // Pay attention that this is 1 hour after the dueDate hour
        // We don't include end bound
        startDate: date(2017, 0, 5, 8),
      });

      expect(result.length).toBe(0);
    });
  });

  describe('ranged tests with multiple patients', () => {
    let patients;
    beforeEach(async () => {
      patients = await Patient.bulkCreate([
        makePatData({ firstName: 'John', lastName: 'Denver', dueForHygieneDate: date(2018, 3, 2, 8), lastHygieneDate: date(2017, 1, 5, 7) }),
        makePatData({ firstName: 'Carol', lastName: 'Heine', dueForHygieneDate: date(2018, 3, 3, 8), lastHygieneDate: date(2017, 1, 5, 7) }),
        makePatData({ firstName: 'Beth', lastName: 'Berth', dueForHygieneDate: date(2018, 3, 3, 17), lastHygieneDate: date(2017, 1, 5, 7) }),
        makePatData({ firstName: 'Herbie', lastName: 'Hancock', dueForHygieneDate: date(2018, 3, 4, 18), lastHygieneDate: date(2017, 1, 5, 7) }),
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('should return Carol Heine and Not John as the StartDate is exclusive and End Date is Inclusive', async () => {
      const result = await getPatientsForRecallTouchPoint({
        recall: { interval: '1 months' },
        account: { id: accountId, recallBuffer: '1 days' },
        startDate: date(2018, 2, 2, 8),
        endDate: date(2018, 2, 3, 8),
      });

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(patients[0].id);
    });

    test('should return Carol Heine and John when date is within bounds', async () => {
      let result = await getPatientsForRecallTouchPoint({
        recall: { interval: '1 months' },
        account: { id: accountId, recallBuffer: '1 days' },
        startDate: date(2018, 2, 2, 7),
        endDate: date(2018, 2, 3, 9),
      });

      expect(result.length).toBe(2);

      result = result.sort((a, b) => moment(a.dueForHygieneDate).isAfter(b.dueForHygieneDate));
      expect(result[0].id).toBe(patients[0].id);
      expect(result[1].id).toBe(patients[1].id);
    });

    test('should return John, Carol, Beth and Herbie when the range includes all their Due Dates', async () => {
      let result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },
        account: {
          id: accountId,
          hygieneInterval: '3 months',
          recallInterval: '3 months',
          recallBuffer: '1 days',
        },
        startDate: date(2018, 2, 2, 7),
        endDate: date(2018, 2, 8, 8),
      });

      expect(result.length).toBe(4);

      result = result.sort((a, b) => moment(a.dueForHygieneDate).isAfter(b.dueForHygieneDate));

      expect(result[0].id).toBe(patients[0].id);
      expect(result[1].id).toBe(patients[1].id);
      expect(result[2].id).toBe(patients[2].id);
      expect(result[3].id).toBe(patients[3].id);
    });

    test('should return none when range doesn\'t include anyone\'s due for hygiene date', async () => {
      const result = await getPatientsForRecallTouchPoint({
        recall: { interval: '1 months' },
        account: { id: accountId, recallBuffer: '1 days' },
        startDate: date(2018, 2, 1, 9),
        endDate: date(2018, 2, 1, 10),
      });

      expect(result.length).toBe(0);
    });
  });

  describe.skip('ranged tests with different date queries', () => {
    let recalls;
    let patients;
    let appointments;
    beforeEach(async () => {
      recalls = await Recall.bulkCreate([
        {
          accountId,
          primaryTypes: ['email'],
          interval: '1 months',
          lengthSeconds: w2s(-1),
        },
      ]);

      patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'John', email: 'hello1@hello.com', lastName: 'Denver', status: 'Active', lastRecallDate: date(2018, 0, 1, 8) }),
        makePatientData({ firstName: 'Carol', email: 'hello2@hello.com', lastName: 'Heine', status: 'Active', lastRecallDate: date(2018, 0, 2, 8) }),
        makePatientData({ firstName: 'Beth', email: 'hello3@hello.com', lastName: 'Berth', status: 'Active', lastRecallDate: date(2018, 0, 2, 17) }),
        makePatientData({ firstName: 'Herbie', email: 'hello4@hello.com', lastName: 'Hancock', status: 'Active', lastRecallDate: date(2018, 0, 3, 18) }),
      ]);

      appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('should return Carol Heine and Not John as the StartDate is exclusive and End Date is Inclusive', async () => {
      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },
        account: {
          id: accountId,
          hygieneInterval: '3 months',
          recallInterval: '3 months',
          recallBuffer: '1 days',
        },
        startDate: date(2018, 2, 2, 8),
        endDate: date(2018, 2, 3, 8),
      });

      expect(result[0].firstName).toBe('Carol');
      expect(result[0].lastName).toBe('Heine');
      expect(result.length).toBe(1);
    });

    test('should return Carol Heine and John when startDate is before John\'s lastHygieneDate', async () => {
      let result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },
        account: {
          id: accountId,
          hygieneInterval: '3 months',
          recallInterval: '3 months',
        },
        startDate: date(2018, 2, 2, 7),
        endDate: date(2018, 2, 3, 8),
      });
      result = result.sort((a, b) => moment(a.lastRecallDate).isAfter(b.lastRecallDate));

      expect(result[0].firstName).toBe('John');
      expect(result[0].lastName).toBe('Denver');
      expect(result[1].firstName).toBe('Carol');
      expect(result[1].lastName).toBe('Heine');
      expect(result.length).toBe(2);
    });

    test('should return John, Carol, Beth and Herbie when the range includes all their Due Dates', async () => {
      let result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },
        account: {
          id: accountId,
          hygieneInterval: '3 months',
          recallInterval: '3 months',
          recallBuffer: '1 days',
        },
        startDate: date(2018, 2, 2, 7),
        endDate: date(2018, 2, 8, 8),
      });

      result = result.sort((a, b) => moment(a.lastRecallDate).isAfter(b.lastRecallDate));

      expect(result[0].firstName).toBe('John');
      expect(result[0].lastName).toBe('Denver');
      expect(result[1].firstName).toBe('Carol');
      expect(result[1].lastName).toBe('Heine');
      expect(result[2].firstName).toBe('Beth');
      expect(result[2].lastName).toBe('Berth');
      expect(result[3].firstName).toBe('Herbie');
      expect(result[3].lastName).toBe('Hancock');
      expect(result.length).toBe(4);
    });

    test('should return none when range doesn\'t include anyone\'s due for hygiene date', async () => {
      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },
        account: {
          id: accountId,
          hygieneInterval: '3 months',
          recallInterval: '3 months',
          recallBuffer: '1 days',
        },
        startDate: date(2018, 2, 2, 9),
        endDate: date(2018, 2, 2, 10),
      });

      expect(result.length).toBe(0);
    });
  });

  describe.skip('ranged tests with multiple patients - lastRecallDate - Carol Inactive', () => {
    let recalls;
    let patients;
    let appointments;
    beforeEach(async () => {
      recalls = await Recall.bulkCreate([
        {
          accountId,
          primaryTypes: ['email'],
          interval: '1 months',
          lengthSeconds: w2s(-1),
        },
      ]);

      patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'John', email: 'hello1@hello.com', lastName: 'Denver', status: 'Active', lastRecallDate: date(2018, 0, 1, 8) }),
        makePatientData({ firstName: 'Carol', email: 'hello2@hello.com', lastName: 'Heine', status: 'Inactive', lastRecallDate: date(2018, 0, 2, 8) }),
        makePatientData({ firstName: 'Beth', email: 'hello3@hello.com', lastName: 'Berth', status: 'Active', lastRecallDate: date(2018, 0, 2, 17) }),
        makePatientData({ firstName: 'Herbie', email: 'hello4@hello.com', lastName: 'Hancock', status: 'Active', lastRecallDate: date(2018, 0, 3, 18) }),
      ]);

      appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('should not return Carol Heine (inactive) and Not John as the StartDate is exclusive and End Date is Inclusive', async () => {
      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },
        account: {
          id: accountId,
          hygieneInterval: '3 months',
          recallInterval: '3 months',
          recallBuffer: '1 days',
        },
        startDate: date(2018, 2, 2, 8),
        endDate: date(2018, 2, 3, 8),
      });
      expect(result.length).toBe(0);
    });

    test('should not return Carol Heine (inactive) and John when startDate is before John\'s lastHygieneDate', async () => {
      let result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },
        account: {
          id: accountId,
          hygieneInterval: '3 months',
          recallInterval: '3 months',
        },
        startDate: date(2018, 2, 2, 7),
        endDate: date(2018, 2, 3, 8),
      });
      result = result.sort((a, b) => moment(a.lastRecallDate).isAfter(b.lastRecallDate));

      expect(result[0].firstName).toBe('John');
      expect(result[0].lastName).toBe('Denver');
      expect(result.length).toBe(1);
    });

    test('should return John, Beth and Herbie when the range includes all their Due Dates', async () => {
      let result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },
        account: {
          id: accountId,
          hygieneInterval: '3 months',
          recallInterval: '3 months',
          recallBuffer: '1 days',
        },
        startDate: date(2018, 2, 2, 7),
        endDate: date(2018, 2, 8, 8),
      });

      result = result.sort((a, b) => moment(a.lastRecallDate).isAfter(b.lastRecallDate));

      expect(result[0].firstName).toBe('John');
      expect(result[0].lastName).toBe('Denver');
      expect(result[1].firstName).toBe('Beth');
      expect(result[1].lastName).toBe('Berth');
      expect(result[2].firstName).toBe('Herbie');
      expect(result[2].lastName).toBe('Hancock');
      expect(result.length).toBe(3);
    });

    test('should return none when range doesn\'t include anyone\'s due for hygiene date', async () => {
      const result = await getPatientsForRecallTouchPoint({
        recall: {
          interval: '1 months',
        },
        account: {
          id: accountId,
          hygieneInterval: '3 months',
          recallInterval: '3 months',
          recallBuffer: '1 days',
        },
        startDate: date(2018, 2, 2, 9),
        endDate: date(2018, 2, 2, 10),
      });

      expect(result.length).toBe(0);
    });
  });
});


import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  Appointment,
  Patient,
  Practitioner,
  Recall,
  SentRecall,
  sequelize,
} from '../../../../server/_models';
import {
  mapPatientsToRecalls,
  getRecallsOutboxList,
  getPatientsDueForRecall,
  shouldSendRecall,
  getPatientsForRecallTouchPoint,
} from '../../../../server/lib/recalls/helpers';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';
import { w2s } from '../../../../server/util/time';

// TODO: make seeds more modular so we can see here
// const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
// const patientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const oneDayReminderId = '8aeab035-b72c-4f7a-ad73-09465cbf5654';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
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

describe('Recalls Calculation Library', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Helpers', () => {
    describe('#mapPatientsToRecalls', () => {
      let recalls;
      let appointments;
      let patients;
      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryType: 'email',
            lengthSeconds: w2s(-1),
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', email: 'test@test.com', lastName: 'Patient', status: 'Active', lastHygieneDate: date(2016, 7, 5, 9) }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test('should be a function', () => {
        expect(typeof mapPatientsToRecalls).toBe('function');
      });

      test('make sure with multiple recalls that are valid. Only the most recent returns', async () => {
        const result = await mapPatientsToRecalls({
          recalls: [{
            interval: '1 months',
            primaryTypes: ['email'],
          },
          {
            interval: '2 months',
            primaryTypes: ['email'],
          }],
          account: {
            id: accountId,
            hygieneInterval: '6 months',
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
    });

    // tests recalls with the right range using hygiene interval
    // they should be sent  based on lasthygieneAppDate + hygiene interval - recallinterval
    describe('#getPatientsForRecallTouchPoint - hygieneInterval', () => {
      test('should be a function', () => {
        expect(typeof getPatientsForRecallTouchPoint).toBe('function');
      });

      let recalls;
      let patients;
      let appointments;
      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryType: 'email',
            lengthSeconds: w2s(-1),
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', lastName: 'Patient', status: 'Active', lastHygieneDate: date(2016, 7, 5, 9) }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      // note that the recall start range is 8 am, but last hygiene is at 9 am. This is because we are crossing over
      // Daylight savings.
      test('hygieneInterval - should return 1 patient for the recall when on the start of the recall range', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '6 months',
          },

          startDate: date(2017, 0, 5, 8),
        });

        expect(result[0].firstName).toBe('Old');
        expect(result[0].lastName).toBe('Patient');
        expect(result.length).toBe(1);
      });

      // note that the recall start range is 8 am, but last hygiene is at 9 am. This is because we are crossing over
      // Daylight savings.
      test('hygieneInterval - should return 0 patient for the recall when 1 hour before of the recall range', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '6 months',
          },

          startDate: date(2017, 0, 5, 7),
        });

        expect(result.length).toBe(0);
      });

      // note that the recall end range is 8 am, but last hygiene is at 9 am. This is because we are crossing over
      // Daylight savings.
      // The end shouldn't be inclusive so that we don't send twice if it falls in it
      test('hygieneInterval - should return 1 patient for the recall when is 1 hour shy of end of the recall range', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '6 months',
          },

          startDate: date(2017, 0, 6, 7),
        });

        expect(result[0].firstName).toBe('Old');
        expect(result[0].lastName).toBe('Patient');
        expect(result.length).toBe(1);
      });

      // note that the recall end range is 8 am, but last hygiene is at 9 am. This is because we are crossing over
      // Daylight savings.
      // The end shouldn't be inclusive so that we don't send twice if it falls in it
      test('hygieneInterval - should return 0 patient for the recall when on the end of the recall range', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '6 months',
          },

          startDate: date(2017, 0, 6, 8),
        });

        expect(result.length).toBe(0);
      });

      test('hygieneInterval - should return 0 patients for the recall when 1 day before the 5 months needs for recall', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },
          account: {
            id: accountId,
            hygieneInterval: '6 months',
          },
          startDate: date(2017, 0, 1, 9),
        });

        expect(result.length).toBe(0);
      });
    });

    // tests recalls with the right range using contCareInterval
    // they should be sent based on lasthygieneAppDate + contCareInterval - recallinterval
    describe('#getPatientsForRecallTouchPoint - contCareInterval', () => {
      let recalls;
      let patients;
      let appointments;
      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryType: 'email',
            lengthSeconds: w2s(-1),
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', lastName: 'Patient', status: 'Active', lastHygieneDate: date(2016, 7, 5, 9), contCareInterval: '6 months' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      // note that the recall start range is 8 am, but last hygiene is at 9 am. This is because we are crossing over
      // Daylight savings.
      test('contCareInterval - should return 1 patient for the recall when on the start of the recall range', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '10 months',
          },

          startDate: date(2017, 0, 5, 8),
        });

        expect(result[0].firstName).toBe('Old');
        expect(result[0].lastName).toBe('Patient');
        expect(result.length).toBe(1);
      });


      test('contCareInterval - should return 1 patient for the recall when on the start of the recall range with negative interval', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '-1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '10 months',
          },

          startDate: date(2017, 2, 5, 8),
        });

        expect(result[0].firstName).toBe('Old');
        expect(result[0].lastName).toBe('Patient');
        expect(result.length).toBe(1);
      });

      // note that the recall start range is 8 am, but last hygiene is at 9 am. This is because we are crossing over
      // Daylight savings.
      test('contCareInterval - should return 0 patient for the recall when 1 hour before of the recall range', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '10 months',
          },

          startDate: date(2017, 0, 5, 7),
        });

        expect(result.length).toBe(0);
      });

      // note that the recall end range is 8 am, but last hygiene is at 9 am. This is because we are crossing over
      // Daylight savings.
      // The end shouldn't be inclusive so that we don't send twice if it falls in it
      test('contCareInterval - should return 1 patient for the recall when is 1 hour shy of end of the recall range', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '10 months',
          },

          startDate: date(2017, 0, 6, 7),
        });

        expect(result[0].firstName).toBe('Old');
        expect(result[0].lastName).toBe('Patient');
        expect(result.length).toBe(1);
      });

      // note that the recall end range is 8 am, but last hygiene is at 9 am. This is because we are crossing over
      // Daylight savings.
      // The end shouldn't be inclusive so that we don't send twice if it falls in it
      test('contCareInterval - should return 0 patient for the recall when on the end of the recall range', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '10 months',
          },

          startDate: date(2017, 0, 6, 8),
        });

        expect(result.length).toBe(0);
      });

      test('contCareInterval - should return 0 patients for the recall when 1 day before the 5 months needs for recall', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },
          account: {
            id: accountId,
            hygieneInterval: '6 months',
          },
          startDate: date(2017, 0, 1, 9),
        });

        expect(result.length).toBe(0);
      });
    });

    // tests recalls with sent recalls of 10 days
    describe('#getPatientsForRecallTouchPoint - SentRecalls', () => {
      let recalls;
      let patients;
      let appointments;

      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryType: 'email',
            lengthSeconds: w2s(-1),
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', lastName: 'Patient', status: 'Active', lastHygieneDate: date(2016, 7, 5, 9) }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
        ]);


        const sentRecalls = await SentRecall.bulkCreate([
          makeSentRecallData({
            appointmentId: appointments[0].id,
            recallId: recalls[0].id,
            patientId: patients[0].id,
            isSent: true,
          }),
        ]);

        await sequelize.query(`UPDATE "SentRecalls"
          SET "createdAt" = '${date(2017, 0, 1, 9)}'`);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test('should return 0 patients when they have a sent recall 10 days ago', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '6 months',
          },

          startDate: date(2017, 0, 5, 9),
        });
        expect(result.length).toBe(0);
      });

    });

    // tests recalls with sent recalls of 10 days, but is sent is false
    describe('#getPatientsForRecallTouchPoint - SentRecalls', () => {
      let recalls;
      let patients;
      let appointments;

      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryType: 'email',
            lengthSeconds: w2s(-1),
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', lastName: 'Patient', status: 'Active', lastHygieneDate: date(2016, 7, 5, 9) }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
        ]);


        const sentRecalls = await SentRecall.bulkCreate([
          makeSentRecallData({
            appointmentId: appointments[0].id,
            recallId: recalls[0].id,
            patientId: patients[0].id,
            isSent: false,
          }),
        ]);

        await sequelize.query(`UPDATE "SentRecalls"
          SET "createdAt" = '${date(2017, 0, 1, 9)}'`);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test('should return 1 patients when they have a sent recall 10 days ago, but isSent is false', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '6 months',
          },

          startDate: date(2017, 0, 5, 9),
        });
        expect(result.length).toBe(1);
      });

    });

    // tests recalls with sent recalls earlier than 15 days
    describe('#getPatientsForRecallTouchPoint - SentRecalls', () => {
      let recalls;
      let patients;
      let appointments;

      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryType: 'email',
            lengthSeconds: w2s(-1),
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', lastName: 'Patient', status: 'Active', lastHygieneDate: date(2016, 7, 5, 9) }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
        ]);


        const sentRecalls = await SentRecall.bulkCreate([
          makeSentRecallData({
            appointmentId: appointments[0].id,
            recallId: recalls[0].id,
            patientId: patients[0].id,
            isSent: true,
          }),
        ]);

        await sequelize.query(`UPDATE "SentRecalls"
          SET "createdAt" = '${date(2016, 11, 19, 9)}'`);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test('should return 1 patients when they have a sent recall 15 days ago', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '6 months',
          },

          startDate: date(2017, 0, 5, 9),
        });
        expect(result.length).toBe(1);
      });

    });

    // tests if the patient preference for recalls is respected
    describe('#getPatientsForRecallTouchPoint - Preferences ', () => {
      let recalls;
      let patients;
      let appointments;

      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryType: 'email',
            lengthSeconds: w2s(-1),
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({
            firstName: 'Old',
            lastName: 'Patient',
            status: 'Active',
            lastHygieneDate: date(2016, 7, 5, 9),
            preferences: { recalls: false },
          }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
        ]);


        const sentRecalls = await SentRecall.bulkCreate([
          makeSentRecallData({
            appointmentId: appointments[0].id,
            recallId: recalls[0].id,
            patientId: patients[0].id,
            isSent: true,
          }),
        ]);

        await sequelize.query(`UPDATE "SentRecalls"
          SET "createdAt" = '${date(2016, 11, 27, 9)}'`);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test('should return 0 patients when the patient has recalls set to false', async () => {
        const result = await getPatientsForRecallTouchPoint({
          recall: {
            interval: '1 months',
          },

          account: {
            id: accountId,
            hygieneInterval: '6 months',
          },

          startDate: date(2017, 0, 5, 9),
        });
        expect(result.length).toBe(0);
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
            lengthSeconds: w2s(-1),
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'John', email: 'hello1@hello.com', lastName: 'Denver', status: 'Active', lastHygieneDate: date(2018, 0, 1, 8) }),
          makePatientData({ firstName: 'Carol', email: 'hello2@hello.com', lastName: 'Heine', status: 'Active', lastHygieneDate: date(2018, 0, 2, 8) }),
          makePatientData({ firstName: 'Beth', email: 'hello3@hello.com', lastName: 'Berth', status: 'Active', lastHygieneDate: date(2018, 0, 2, 17) }),
          makePatientData({ firstName: 'Herbie', email: 'hello4@hello.com', lastName: 'Hancock', status: 'Active', lastHygieneDate: date(2018, 0, 3, 18) }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test('check to see if getRecallsOutboxList returns the right order and format', async () => {
        const result = await getRecallsOutboxList({
          account: {
            id: accountId,
            hygieneInterval: '3 months',
          },
          startDate: date(2018, 2, 2, 7),
          endDate: date(2018, 2, 8, 8),
        });

        expect(result[0].patient.firstName).toBe('John');
        expect(result[0].patient.lastName).toBe('Denver');
        expect(result[1].patient.firstName).toBe('Carol');
        expect(result[1].patient.lastName).toBe('Heine');
        expect(result[2].patient.firstName).toBe('Beth');
        expect(result[2].patient.lastName).toBe('Berth');
        expect(result[3].patient.firstName).toBe('Herbie');
        expect(result[3].patient.lastName).toBe('Hancock');
        expect(result.length).toBe(4);

        expect(result[0].primaryTypes[0]).toBe('email');
        expect(result[1].primaryTypes[0]).toBe('email');
        expect(result[2].primaryTypes[0]).toBe('email');
        expect(result[3].primaryTypes[0]).toBe('email');

        expect(moment(result[0].sendDate).isBefore(result[1].sendDate)).toBe(true);
        expect(moment(result[0].sendDate).isBefore(result[2].sendDate)).toBe(true);
        expect(moment(result[0].sendDate).isBefore(result[3].sendDate)).toBe(true);
      });

    });

    describe('#getRecallsOutboxList', () => {
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
          makePatientData({ firstName: 'Old', email: 'hello@hello.com', lastName: 'Patient', status: 'Active', lastHygieneDate: date(2016, 7, 5, 9), contCareInterval: '6 months' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      // Since account doesn't have a timezone defaults to server time or PST, so sendDate should be
      // at 5 pm PST
      test('should return 1 - with sendDate runing at 5 pm PST when no timezone', async () => {
        const result = await getRecallsOutboxList({
          account: {
            id: accountId,
            hygieneInterval: '10 months',
          },
          startDate: date(2016, 0, 1, 9),
          endDate: date(2017, 8, 8, 9),
        });

        expect(result[0].patient.firstName).toBe('Old');
        expect(result[0].patient.lastName).toBe('Patient');
        expect(result[0].sendDate).toBe(date(2017, 0, 5, 17));
        expect(result.length).toBe(1);
      });

      // Since account has a new york a timezone dit should be 2pm PST as that's 5pm ESt
      test('should return 1 - with sendDate runing at 2 pm PST when time zone is New York', async () => {
        const result = await getRecallsOutboxList({
          account: {
            id: accountId,
            hygieneInterval: '10 months',
            timezone: 'America/New_York',
          },
          startDate: date(2016, 0, 1, 9),
          endDate: date(2017, 8, 8, 9),
        });

        expect(result[0].patient.firstName).toBe('Old');
        expect(result[0].patient.lastName).toBe('Patient');
        expect(result[0].sendDate).toBe(date(2017, 0, 5, 14));
        expect(result.length).toBe(1);
      });
    });

    describe('#getPatientsForRecallTouchPoint - ranged tests with multiple patients', () => {
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
          makePatientData({ firstName: 'John', email: 'hello1@hello.com', lastName: 'Denver', status: 'Active', lastHygieneDate: date(2018, 0, 1, 8) }),
          makePatientData({ firstName: 'Carol', email: 'hello2@hello.com', lastName: 'Heine', status: 'Active', lastHygieneDate: date(2018, 0, 2, 8) }),
          makePatientData({ firstName: 'Beth', email: 'hello3@hello.com', lastName: 'Berth', status: 'Active', lastHygieneDate: date(2018, 0, 2, 17) }),
          makePatientData({ firstName: 'Herbie', email: 'hello4@hello.com', lastName: 'Hancock', status: 'Active', lastHygieneDate: date(2018, 0, 3, 18) }),
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
          },
          startDate: date(2018, 2, 2, 7),
          endDate: date(2018, 2, 3, 8),
        });
        result = result.sort((a, b) => moment(a.lastHygieneDate).isAfter(b.lastHygieneDate));

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
          },
          startDate: date(2018, 2, 2, 7),
          endDate: date(2018, 2, 8, 8),
        });

        result = result.sort((a, b) => moment(a.lastHygieneDate).isAfter(b.lastHygieneDate));

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
          },
          startDate: date(2018, 2, 2, 9),
          endDate: date(2018, 2, 2, 10),
        });

        expect(result.length).toBe(0);
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
  });
});


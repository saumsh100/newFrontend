
import moment from 'moment';
import {
  Appointment,
  AppointmentCode,
  Patient,
  PatientRecall,
} from '../../../../../server/_models';
import { getPatientsThatAreDue } from '../../../../../server/lib/dueDate/patientRecalls';
import { seedTestUsers, accountId } from '../../../../util/seedTestUsers';
import { patientId } from '../../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../../util/seedTestPractitioners';
import { wipeAllModels } from '../../../../util/wipeModel';

const DEFAULT_TYPE = 'HYGIENE';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
  reason: DEFAULT_TYPE,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
  lastHygieneDate: moment('2018-01-11 08:00:00').toISOString(),
  lastRecallDate: moment('2018-01-11 08:00:00').toISOString(),
}, data);

const makePatientRecallData = (data = {}) => Object.assign({
  accountId,
  patientId,
  type: DEFAULT_TYPE,
}, data);

const dates = d => ({ startDate: moment(d).toISOString(), endDate: moment(d).add(1, 'hours').toISOString() });

describe('Due Date Calculations - patientRecalls', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPractitioners();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#getPatientsThatAreDue', () => {
    test('should be a function', () => {
      expect(typeof getPatientsThatAreDue).toBe('function');
    });

    describe('Single Patient', () => {
      let patients;
      let appointments;
      let patientRecalls;
      beforeEach(async () => {
        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'A', lastName: 'B' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates('2018-01-12 08:00:00') }),
        ]);

        patientRecalls = await PatientRecall.bulkCreate([
          makePatientRecallData({ patientId: patients[0].id, dueDate: moment('2018-01-11 08:00:00').toISOString() }),
          makePatientRecallData({ patientId: patients[0].id, dueDate: moment('2018-05-15 08:00:00').toISOString() }),
          makePatientRecallData({ patientId: patients[0].id, dueDate: moment('2018-06-15 08:00:00').toISOString() }),
        ]);
      });

      test('should return 1 patient because they dont have a future booked appt', async () => {
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await getPatientsThatAreDue({
          accountId,
          date,
          appointmentTypes: [DEFAULT_TYPE],
          patientRecallTypes: [DEFAULT_TYPE],
          patientAttribute: 'lastHygieneDate',
        });

        expect(ps.length).toBe(1);
        expect(ps[0].id).toBe(patients[0].id);
      });

      test('should return 0 patients because now they have a booked appointment', async () => {
        await Appointment.create(makeApptData({ patientId: patients[0].id, ...dates('2018-05-15 08:00:00') }));
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await getPatientsThatAreDue({
          accountId,
          date,
          appointmentTypes: [DEFAULT_TYPE],
          patientRecallTypes: [DEFAULT_TYPE],
          patientAttribute: 'lastHygieneDate',
        });

        expect(ps.length).toBe(0);
      });

      test('should return 1 patients because now they have a booked appointment but reason is null', async () => {
        await Appointment.create(makeApptData({ patientId: patients[0].id, ...dates('2018-05-15 08:00:00'), reason: null }));
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await getPatientsThatAreDue({
          accountId,
          date,
          appointmentTypes: [DEFAULT_TYPE],
          patientRecallTypes: [DEFAULT_TYPE],
          patientAttribute: 'lastHygieneDate',
        });

        expect(ps.length).toBe(1);
      });

      test('should return 1 patient because the future booked appointment is not the right type', async () => {
        await Appointment.create(makeApptData({ patientId: patients[0].id, ...dates('2018-05-15 08:00:00'), reason: 'CAT' }));
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await getPatientsThatAreDue({
          accountId,
          date,
          appointmentTypes: [DEFAULT_TYPE],
          patientRecallTypes: [DEFAULT_TYPE],
          patientAttribute: 'lastHygieneDate',
        });

        expect(ps.length).toBe(1);
        expect(ps[0].id).toBe(patients[0].id);
      });

      test('should return 0 patients because the patientRecalls are all later than lastHygieneDate', async () => {
        await patients[0].update({ lastHygieneDate: moment('2018-06-20 08:00:00').toISOString() });
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await getPatientsThatAreDue({
          accountId,
          date,
          appointmentTypes: [DEFAULT_TYPE],
          patientRecallTypes: [DEFAULT_TYPE],
          patientAttribute: 'lastHygieneDate',
        });

        expect(ps.length).toBe(0);
      });

      test('should return 0 patients because the appointmentCodes are matching codesQuery', async () => {
        const { id } = await Appointment.create(makeApptData({
          patientId: patients[0].id,
          ...dates('2018-05-15 08:00:00'),
          reason: 'CAT',
        }));

        await AppointmentCode.bulkCreate([
          { appointmentId: id, code: '11101' },
          { appointmentId: id, code: '22232' },
        ]);

        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await getPatientsThatAreDue({
          accountId,
          date,
          appointmentTypes: ['CRAZY_HYGIENE_REASON'], // needs to be different than default so they are not returned
          patientRecallTypes: ['CRAZY_HYGIENE_REASON'],
          patientAttribute: 'lastHygieneDate',
          codesQuery: { $like: '111%' },
        });

        expect(ps.length).toBe(0);
      });

      test('should return 1 patient because the appointmentCodes are not the right kind for that appt', async () => {
        const { id } = await Appointment.create(makeApptData({
          patientId: patients[0].id,
          ...dates('2018-05-15 08:00:00'),
          reason: 'CAT',
        }));

        await AppointmentCode.bulkCreate([
          { appointmentId: id, code: '99999' },
          { appointmentId: id, code: '22232' },
        ]);

        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await getPatientsThatAreDue({
          accountId,
          date,
          appointmentTypes: ['CRAZY_HYGIENE_REASON'],
          patientRecallTypes: ['CRAZY_HYGIENE_REASON'], // needs to be different than default so they are not returned
          patientAttribute: 'lastHygieneDate',
          codesQuery: { $like: '111%' },
        });

        expect(ps.length).toBe(1);
        expect(ps[0].id).toBe(patients[0].id);
      });
    });

    describe('Multiple Patients', () => {
      let patients;
      let appointments;
      let patientRecalls;
      beforeEach(async () => {
        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'A', lastName: 'B' }),
          makePatientData({ firstName: 'B', lastName: 'C' }),
          makePatientData({ firstName: 'C', lastName: 'D' }),
          makePatientData({ firstName: 'D', lastName: 'E' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates('2018-05-15 08:00:00') }),
          makeApptData({ patientId: patients[1].id, ...dates('2018-05-15 08:00:00') }),
          makeApptData({ patientId: patients[2].id, ...dates('2018-05-15 08:00:00'), type: 'BLANK' }),
          makeApptData({ patientId: patients[3].id, ...dates('2018-05-15 08:00:00'), type: 'BLANK' }),
        ]);

        patientRecalls = await PatientRecall.bulkCreate([
          makePatientRecallData({ patientId: patients[0].id, dueDate: moment('2018-05-15 08:00:00').toISOString() }),
          makePatientRecallData({ patientId: patients[1].id, dueDate: moment('2018-05-15 08:00:00').toISOString() }),
          makePatientRecallData({ patientId: patients[2].id, dueDate: moment('2018-05-15 08:00:00').toISOString(), type: 'BLANK' }),
          makePatientRecallData({ patientId: patients[3].id, dueDate: moment('2018-05-15 08:00:00').toISOString(), type: 'BLANK' }),
        ]);
      });

      test('should return 0 patients cause the appointments are booked', async () => {
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await getPatientsThatAreDue({
          accountId,
          date,
          appointmentTypes: [DEFAULT_TYPE],
          patientRecallTypes: [DEFAULT_TYPE],
          patientAttribute: 'lastHygieneDate',
        });

        expect(ps.length).toBe(0);
      });

      test('should return 0 patients cause the appointments are booked', async () => {
        await appointments[0].update({ ...dates('2018-03-20 08:00:00') });
        await appointments[1].update({ ...dates('2018-03-20 08:00:00') });
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await getPatientsThatAreDue({
          accountId,
          date,
          appointmentTypes: [DEFAULT_TYPE],
          patientRecallTypes: [DEFAULT_TYPE],
          patientAttribute: 'lastHygieneDate',
        });

        expect(ps.length).toBe(2);
      });
    });
  });
});

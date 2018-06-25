
import moment from 'moment';
import keyBy from 'lodash/keyBy';
import {
  Appointment,
  Patient,
  PatientRecall,
} from '../../../../../server/_models';
import { updatePatientDueDateFromPatientRecalls } from '../../../../../server/lib/dueDate/patientRecalls';
import { seedTestUsers, accountId } from '../../../../util/seedTestUsers';
import { patientId } from '../../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../../util/seedTestPractitioners';
import wipeModel, { wipeAllModels } from '../../../../util/wipeModel';

const DEFAULT_HYGIENE = 'HYGIENE';
const DEFAULT_RECALL = 'RECALL';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
  reason: DEFAULT_HYGIENE,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
  lastHygieneDate: moment('2018-01-11 08:00:00').toISOString(),
  lastRecallDate: moment('2018-01-11 08:00:00').toISOString(),
}, data);

const makePatientRecallData = (data = {}) => Object.assign({
  accountId,
  patientId,
  type: DEFAULT_HYGIENE,
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

  describe('#updatePatientDueDateFromPatientRecalls', () => {
    test('should be a function', () => {
      expect(typeof updatePatientDueDateFromPatientRecalls).toBe('function');
    });

    describe('Integration Test', () => {
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
          makeApptData({ patientId: patients[2].id, ...dates('2018-05-15 08:00:00'), reason: DEFAULT_RECALL }),
          makeApptData({ patientId: patients[3].id, ...dates('2018-05-15 08:00:00'), reason: DEFAULT_RECALL }),
        ]);

        patientRecalls = await PatientRecall.bulkCreate([
          makePatientRecallData({ patientId: patients[0].id, dueDate: moment('2018-05-15 08:00:00').toISOString() }),
          makePatientRecallData({ patientId: patients[1].id, dueDate: moment('2018-05-15 08:00:00').toISOString() }),
          makePatientRecallData({ patientId: patients[2].id, dueDate: moment('2018-05-15 08:00:00').toISOString(), type: DEFAULT_RECALL }),
          makePatientRecallData({ patientId: patients[3].id, dueDate: moment('2018-05-15 08:00:00').toISOString(), type: DEFAULT_RECALL }),
        ]);
      });

      test('should update 0 patients cause the patientIds argument is empty', async () => {
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await updatePatientDueDateFromPatientRecalls({
          accountId,
          date,
          hygieneTypes: [DEFAULT_HYGIENE],
          recallTypes: [DEFAULT_RECALL],
          patientIds: [],
        });

        expect(ps.length).toBe(0);
      });

      test('should return 0 patients cause the appointments are booked', async () => {
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await updatePatientDueDateFromPatientRecalls({
          accountId,
          date,
          hygieneTypes: [DEFAULT_HYGIENE],
          recallTypes: [DEFAULT_RECALL],
        });

        expect(ps.length).toBe(0);
      });

      test('should return 4 patients cause the appointments are not booked', async () => {
        await wipeModel(Appointment);
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await updatePatientDueDateFromPatientRecalls({
          accountId,
          date,
          hygieneTypes: [DEFAULT_HYGIENE],
          recallTypes: [DEFAULT_RECALL],
        });

        expect(ps.length).toBe(4);
      });

      test('should return 4 patients cause the appointments are not booked and its using the accouns fallback', async () => {
        await wipeModel(Appointment);
        await wipeModel(PatientRecall);
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await updatePatientDueDateFromPatientRecalls({
          accountId,
          date,
          hygieneTypes: [DEFAULT_HYGIENE],
          recallTypes: [DEFAULT_RECALL],
          hygieneInterval: '6 months',
          recallInterval: '6 months',
        });

        expect(ps.length).toBe(4);

        const d = moment('2018-07-11 08:00:00').toISOString();
        const patientIds = patients.map(p => p.id);
        const nps = await Patient.findAll({ where: { id: patientIds }, raw: true });
        expect(nps[0].dueForHygieneDate.toISOString()).toBe(d);
        expect(nps[0].dueForRecallExamDate.toISOString()).toBe(d);
        expect(nps[1].dueForHygieneDate.toISOString()).toBe(d);
        expect(nps[1].dueForRecallExamDate.toISOString()).toBe(d);
        expect(nps[2].dueForHygieneDate.toISOString()).toBe(d);
        expect(nps[2].dueForRecallExamDate.toISOString()).toBe(d);
        expect(nps[3].dueForHygieneDate.toISOString()).toBe(d);
        expect(nps[3].dueForRecallExamDate.toISOString()).toBe(d);
      });

      test('should return 2 patients', async () => {
        const wd = moment('2018-02-20 08:00:00').toISOString(); // wrong date
        await wipeModel(Appointment);
        await wipeModel(PatientRecall);
        // We are updating dueForHygieneDate to ensure that Patients are getting updated with null and correct values
        await patients[1].update({ lastHygieneDate: null, dueForHygieneDate: wd, dueForRecallExamDate: wd });
        await patients[2].update({ lastRecallDate: null, dueForHygieneDate: wd, dueForRecallExamDate: wd });
        await patients[3].update({ lastHygieneDate: null, lastRecallDate: null, dueForHygieneDate: wd, dueForRecallExamDate: wd });
        const date = moment('2018-04-20 08:00:00').toISOString();
        const ps = await updatePatientDueDateFromPatientRecalls({
          accountId,
          date,
          hygieneTypes: [DEFAULT_HYGIENE],
          recallTypes: [DEFAULT_RECALL],
          hygieneInterval: '6 months',
          recallInterval: '6 months',
        });

        expect(ps.length).toBe(3);

        const d = moment('2018-07-11 08:00:00').toISOString();
        const patientIds = patients.map(p => p.id);
        const updatedPatients = await Patient.findAll({ where: { id: patientIds }, raw: true });
        const nps = keyBy(updatedPatients, 'id');

        expect(nps[patientIds[0]].dueForHygieneDate.toISOString()).toBe(d);
        expect(nps[patientIds[0]].dueForRecallExamDate.toISOString()).toBe(d);
        expect(nps[patientIds[1]].dueForHygieneDate).toBe(null);
        expect(nps[patientIds[1]].dueForRecallExamDate.toISOString()).toBe(d);
        expect(nps[patientIds[2]].dueForHygieneDate.toISOString()).toBe(d);
        expect(nps[patientIds[2]].dueForRecallExamDate).toBe(null);
        expect(nps[patientIds[3]].dueForHygieneDate).toBe(null);
        expect(nps[patientIds[3]].dueForRecallExamDate).toBe(null);
      });
    });
  });
});

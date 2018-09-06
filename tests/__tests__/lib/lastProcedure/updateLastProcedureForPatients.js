
import {
  Appointment,
  Patient,
  DeliveredProcedure,
} from 'CareCruModels';
import updateLastProcedureForPatients from '../../../../server/lib/lastProcedure/updateLastProcedureForPatients';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import { wipeAllModels } from '../../../util/wipeModel';
import { tzIso } from '../../../../server/util/time';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
  firstName: data.n,
  lastName: data.n,
});

const makeDPData = (config = {}) => Object.assign({}, {
  accountId,
  procedureCode: config.code || code,
}, config);

const TIME_ZONE = 'America/Vancouver';
const td = d => tzIso(d, TIME_ZONE);

const defaultHygieneTypes = ['11_', '112'];
const defaultRecallTypes = ['99%'];
const defaultRestorativeTypes = ['222'];

describe('Last Procedure Calculations', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPractitioners();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#updateLastProcedureForPatients', () => {
    test('should be a function', () => {
      expect(typeof updateLastProcedureForPatients).toBe('function');
    });

    let patients = null;
    let deliveredProcedures = null;
    beforeEach(async () => {
      patients = await Patient.bulkCreate([
        makePatientData({ n: 'A' }),
        makePatientData({ n: 'B' }),
        makePatientData({ n: 'C' }),
      ]);

      deliveredProcedures = await DeliveredProcedure.bulkCreate([
        makeDPData({ code: '111', entryDate: td('2018-08-15 08:30:00'), patientId: patients[0].id }),
        makeDPData({ code: '112', entryDate: td('2018-08-15 09:00:00'), patientId: patients[0].id }),
        makeDPData({ code: '333', entryDate: td('2018-08-03 09:00:00'), patientId: patients[0].id }),
        makeDPData({ code: '999', entryDate: td('2018-02-26 09:00:00'), patientId: patients[0].id }),
        makeDPData({ code: '112', entryDate: td('2018-02-26 09:30:00'), patientId: patients[0].id }),
      ]);
    });

    test('should update lastHygieneDate for patientA and leave patientB & patientC alone as they have no DPs', async () => {
      const updatedHygienePatients = await updateLastProcedureForPatients({
        accountId,
        patientIds: null,
        procedureAttr: 'lastHygieneDate',
        procedureApptAttr: 'lastHygieneApptId',
        procedureCodes: defaultHygieneTypes,
      });

      expect(updatedHygienePatients.length).toBe(1);

      const patientA = await Patient.findById(patients[0].id);
      expect(patientA.lastHygieneDate.toISOString()).toBe(td('2018-08-15 09:00:00'));
      expect(patientA.lastHygieneApptId).toBe(null);
    });

    test('should update lastRecallDate for patientA and leave patientB & patientC alone as they have no DPs', async () => {
      const updatedRecallPatients = await updateLastProcedureForPatients({
        accountId,
        patientIds: null,
        procedureAttr: 'lastRecallDate',
        procedureApptAttr: 'lastRecallApptId',
        procedureCodes: defaultRecallTypes,
      });

      expect(updatedRecallPatients.length).toBe(1);

      const patientA = await Patient.findById(patients[0].id);
      expect(patientA.lastRecallDate.toISOString()).toBe(td('2018-02-26 09:00:00'));
      expect(patientA.lastRecallApptId).toBe(null);
    });

    test('should not update lastRestorativeDate for anyone as there are no DPs', async () => {
      const updatedRestorativePatients = await updateLastProcedureForPatients({
        accountId,
        patientIds: null,
        procedureAttr: 'lastRestorativeDate',
        procedureApptAttr: 'lastRestorativeApptId',
        procedureCodes: defaultRestorativeTypes,
      });

      expect(updatedRestorativePatients.length).toBe(0);

      // Just double check to ensure its null
      const patientA = await Patient.findById(patients[0].id);
      expect(patientA.lastRestorativeDate).toBe(null);
      expect(patientA.lastRestorativeApptId).toBe(null);
    });

    test('should not update to null for a patient that has no DPs even after it was set', async () => {
      await patients[1].update({ lastHygieneDate: td('2018-08-15 08:30:00') });
      const updatedRestorativePatients = await updateLastProcedureForPatients({
        accountId,
        patientIds: [patients[1].id],
        procedureAttr: 'lastHygieneDate',
        procedureApptAttr: 'lastHygieneApptId',
        procedureCodes: ['999'],
      });

      expect(updatedRestorativePatients.length).toBe(0);

      // Just double check to ensure its null
      const patientB = await Patient.findById(patients[1].id);
      expect(patientB.lastHygieneDate).toBe(null);
      expect(patientB.lastHygieneApptId).toBe(null);
    });

    test('should not update lastRestorativeDate for anyone as there are no DPs', async () => {
      const updatedRestorativePatients = await updateLastProcedureForPatients({
        accountId,
        patientIds: [patients[0].id],
        procedureAttr: 'lastHygieneDate',
        procedureApptAttr: 'lastHygieneApptId',
        procedureCodes: ['999'],
      });

      expect(updatedRestorativePatients.length).toBe(1);

      // Just double check to ensure its null
      const patientA = await Patient.findById(patients[0].id);
      expect(patientA.lastHygieneDate.toISOString()).toBe(td('2018-02-26 09:00:00'));
      expect(patientA.lastHygieneApptId).toBe(null);
    });

    test('should consistently update to null the correct patients', async () => {
      await DeliveredProcedure.update({ patientId: patients[1].id }, { where: {}, hooks: false });
      let updatedHygienePatients = await updateLastProcedureForPatients({
        accountId,
        patientIds: null,
        procedureAttr: 'lastHygieneDate',
        procedureApptAttr: 'lastHygieneApptId',
        procedureCodes: defaultHygieneTypes,
      });

      expect(updatedHygienePatients.length).toBe(1);

      let patientB = await Patient.findById(patients[1].id);
      expect(patientB.lastHygieneDate.toISOString()).toBe(td('2018-08-15 09:00:00'));

      await DeliveredProcedure.update({ patientId: patients[2].id }, { where: {}, hooks: false });

      updatedHygienePatients = await updateLastProcedureForPatients({
        accountId,
        patientIds: null,
        procedureAttr: 'lastHygieneDate',
        procedureApptAttr: 'lastHygieneApptId',
        procedureCodes: defaultHygieneTypes,
      });

      expect(updatedHygienePatients.length).toBe(1);

      patientB = await Patient.findById(patients[1].id);
      const patientC = await Patient.findById(patients[2].id);
      expect(patientC.lastHygieneDate.toISOString()).toBe(td('2018-08-15 09:00:00'));
      expect(patientB.lastHygieneDate).toBe(null);
    });

    test('should set appointmentId properly for lastHygieneApptId', async () => {
      const startDate = td('2018-08-15');
      const appointment = await Appointment.create(makeApptData({ patientId: patients[0].id, startDate, endDate: startDate }));
      const updatedHygienePatients = await updateLastProcedureForPatients({
        accountId,
        patientIds: null,
        procedureAttr: 'lastHygieneDate',
        procedureApptAttr: 'lastHygieneApptId',
        procedureCodes: defaultHygieneTypes,
        numHoursNearDate: 16,
      });

      expect(updatedHygienePatients.length).toBe(1);

      const patientA = await Patient.findById(patients[0].id);
      expect(patientA.lastHygieneDate.toISOString()).toBe(td('2018-08-15 09:00:00'));
      expect(patientA.lastHygieneApptId).toBe(appointment.id);
    });

    test('should note set appointmentId if its a cancelled appointment', async () => {
      const startDate = td('2018-08-15');
      await Appointment.create(makeApptData({ patientId: patients[0].id, startDate, endDate: startDate, isCancelled: true }));
      const updatedHygienePatients = await updateLastProcedureForPatients({
        accountId,
        patientIds: null,
        procedureAttr: 'lastHygieneDate',
        procedureApptAttr: 'lastHygieneApptId',
        procedureCodes: defaultHygieneTypes,
        numHoursNearDate: 16,
      });

      expect(updatedHygienePatients.length).toBe(1);

      const patientA = await Patient.findById(patients[0].id);
      expect(patientA.lastHygieneDate.toISOString()).toBe(td('2018-08-15 09:00:00'));
      expect(patientA.lastHygieneApptId).toBe(null);
    });
  });
});

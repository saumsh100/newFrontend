import moment from 'moment';
import {
  Appointment,
  Patient,
  DeliveredProcedure,
} from '../../../../server/_models';
import { getPatientsChangedDeliveredProcedure, updateMostRecentHygiene } from '../../../../server/lib/lastHygiene';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../util/seedTestPatients';
import { code, seedTestProcedures, wipeTestProcedures } from '../../../util/seedTestProcedures';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import wipeModel, { wipeAllModels } from '../../../util/wipeModel';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makeDeliveredProcedure = (config = {}) => Object.assign({}, {
  accountId,
  patientId,
  procedureCode: code,
  procedureCodeId: `CDA-${code}`,
  entryDate: '2017-07-19T00:14:30.932Z',
}, config);

describe('Last Hygiene Calculations', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    await seedTestProcedures();
  });

  afterAll(async () => {
    await wipeModel(DeliveredProcedure);
    await wipeTestProcedures();
    await wipeAllModels();
  });

  describe('#getPatientsChangedDeliveredProcedure - returns an array of patient if a newer/updated/deleted from date from delivered procedures', () => {
    test('should be a function', () => {
      expect(typeof getPatientsChangedDeliveredProcedure).toBe('function');
    });

    beforeEach(async () => {

    });

    afterEach(async () => {
      await wipeModel(DeliveredProcedure);
    });

    test('should return one patient as a new hygiene was created', async() => {
      const dateBeforeCreated = moment();
      await DeliveredProcedure.create(makeDeliveredProcedure());

      const changedPatients = await getPatientsChangedDeliveredProcedure(dateBeforeCreated.toISOString(), accountId);
      expect(changedPatients[0]).toBe('10518e11-b9d2-4d74-9887-29eaae7b5938');
      expect(changedPatients.length).toBe(1);
    });

    test('should return no patients as a new hygiene was created before the check date', async() => {
      await DeliveredProcedure.create(makeDeliveredProcedure());

      const dateAfterCreated = moment();

      const changedPatients = await getPatientsChangedDeliveredProcedure(dateAfterCreated.add(1, 'hours').toISOString(), accountId);
      expect(changedPatients.length).toBe(0);
    });

    test('should return one patient as a the hygiene was updated', async() => {
      const dp = await DeliveredProcedure.create(makeDeliveredProcedure());

      const dateAfterCreated = moment();

      await dp.update({ entryDate: '2017-07-20T00:14:30.932Z' });

      const changedPatients = await getPatientsChangedDeliveredProcedure(dateAfterCreated.toISOString(), accountId);
      expect(changedPatients[0]).toBe('10518e11-b9d2-4d74-9887-29eaae7b5938');
      expect(changedPatients.length).toBe(1);
    });

    test('should return no patients as a new hygiene was updated before the check date', async() => {
      const dp = await DeliveredProcedure.create(makeDeliveredProcedure());

      await dp.update({ entryDate: '2017-07-20T00:14:30.932Z' });

      const dateAfterUpdated = moment();

      const changedPatients = await getPatientsChangedDeliveredProcedure(dateAfterUpdated.toISOString(), accountId);
      expect(changedPatients.length).toBe(0);
    });

    test('should return one patient as one of the hygiene was deleted', async() => {
      const dp = await DeliveredProcedure.create(makeDeliveredProcedure());
      await DeliveredProcedure.create(makeDeliveredProcedure());

      const dateAfterCreated = moment();

      await dp.destroy();

      const changedPatients = await getPatientsChangedDeliveredProcedure(dateAfterCreated.toISOString(), accountId);
      expect(changedPatients[0]).toBe('10518e11-b9d2-4d74-9887-29eaae7b5938');
      expect(changedPatients.length).toBe(1);
    });

    test('should return no patients as a new hygiene was deleted before the check date', async() => {
      const dp = await DeliveredProcedure.create(makeDeliveredProcedure());
      await DeliveredProcedure.create(makeDeliveredProcedure());

      await dp.destroy();

      const dateAfterDeleted = moment();

      const changedPatients = await getPatientsChangedDeliveredProcedure(dateAfterDeleted.toISOString(), accountId);
      expect(changedPatients.length).toBe(0);
    });
  });

  describe('#updateMostRecentHygiene - updates lastHygiene and lastHygieneAppId', () => {
    test('should be a function', () => {
      expect(typeof updateMostRecentHygiene).toBe('function');
    });

    beforeEach(async () => {
      await wipeAllModels();
      await seedTestUsers();
      await seedTestPatients();
      await seedTestPractitioners();
      await seedTestProcedures();
    });

    afterEach(async () => {
      await wipeModel(DeliveredProcedure);
      await wipeTestProcedures();
      await wipeAllModels();
    });

    test('should update one patient with hygiene data and be able to link an appointment', async() => {
      await DeliveredProcedure.create(makeDeliveredProcedure({ entryDate: '2017-07-20T00:14:30.932Z' }));
      const appointmentCreated = await Appointment.create(makeApptData({
        startDate: '2017-07-20T00:14:30.932Z',
        endDate: '2017-07-20T00:15:30.932Z',
      }));

      await updateMostRecentHygiene(accountId, [patientId]);

      const patientUpdated = await Patient.findOne({ where: { id: patientId } });

      expect(patientUpdated.lastHygieneApptId).toBe(appointmentCreated.id);
      expect(moment(patientUpdated.lastHygieneDate).toISOString()).toBe(moment('2017-07-20T00:14:30.932Z').toISOString());
    });

    test('should update one patient with hygiene data and be able to link an appointment - passing no ids, so all patients in account', async() => {
      await DeliveredProcedure.create(makeDeliveredProcedure({ entryDate: '2017-07-20T00:14:30.932Z' }));
      const appointmentCreated = await Appointment.create(makeApptData({
        startDate: '2017-07-20T00:14:30.932Z',
        endDate: '2017-07-20T00:15:30.932Z',
      }));

      await updateMostRecentHygiene(accountId);

      const patientUpdated = await Patient.findOne({ where: { id: patientId } });

      expect(patientUpdated.lastHygieneApptId).toBe(appointmentCreated.id);
      expect(moment(patientUpdated.lastHygieneDate).toISOString()).toBe(moment('2017-07-20T00:14:30.932Z').toISOString());
    });

    test('should update one patient with hygiene data and be NOT able to link an appointment', async() => {
      await DeliveredProcedure.create(makeDeliveredProcedure({ entryDate: '2017-07-20T00:14:30.932Z' }));

      await updateMostRecentHygiene(accountId, [patientId]);

      const patientUpdated = await Patient.findOne({ where: { id: patientId } });

      expect(moment(patientUpdated.lastHygieneDate).toISOString()).toBe(moment('2017-07-20T00:14:30.932Z').toISOString());
    });

    test('should update one patient with hygiene data and be able to link an appointment and then null out when procedure is deleted', async() => {
      await DeliveredProcedure.create(makeDeliveredProcedure({ entryDate: '2017-07-20T00:14:30.932Z' }));
      const appointmentCreated = await Appointment.create(makeApptData({
        startDate: '2017-07-20T00:14:30.932Z',
        endDate: '2017-07-20T00:15:30.932Z',
      }));

      await updateMostRecentHygiene(accountId, [patientId]);

      const patientUpdated = await Patient.findOne({ where: { id: patientId } });

      await wipeModel(DeliveredProcedure);

      await updateMostRecentHygiene(accountId, [patientId]);

      const patientUpdatedAgain = await Patient.findOne({ where: { id: patientId } });

      expect(patientUpdated.lastHygieneApptId).toBe(appointmentCreated.id);
      expect(moment(patientUpdated.lastHygieneDate).toISOString()).toBe(moment('2017-07-20T00:14:30.932Z').toISOString());

      expect(patientUpdatedAgain.lastHygieneApptId).toBeNull();
      expect(patientUpdatedAgain.lastHygieneDate).toBeNull();
    });
  });
});

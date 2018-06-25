
import moment from 'moment';
import {
  Appointment,
  AppointmentCode,
  Patient,
  DeliveredProcedure,
  sequelize,
} from '../../../../../server/_models/index';
import { updatePatientDueDate } from '../../../../../server/lib/dueDate/pendingAppts';
import { getPatientsWithChangedDueDateInfo } from '../../../../../server/lib/dueDate/patientRecalls';
import { seedTestUsers, accountId } from '../../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../../util/seedTestPatients';
import { code, seedTestProcedures, wipeTestProcedures } from '../../../../util/seedTestProcedures';
import { seedTestPractitioners, practitionerId } from '../../../../util/seedTestPractitioners';
import wipeModel, { wipeAllModels } from '../../../../util/wipeModel';

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

  describe('#getPatientsChangedAppointment - returns an array of patient if a newer/updated/deleted from date from changed dueDate info', () => {
    test('should be a function', () => {
      expect(typeof getPatientsWithChangedDueDateInfo).toBe('function');
    });

    test('should return one patient (no duplicates) when both the appointment and patient was changed', async() => {
      const dateBeforeCreated = moment().subtract(1, 'days');
      await DeliveredProcedure.create(makeDeliveredProcedure());
      await Appointment.create(makeApptData({
        startDate: '2017-07-20T00:14:30.932Z',
        endDate: '2017-07-20T00:15:30.932Z',
      }));

      const changedPatients = await getPatientsWithChangedDueDateInfo(dateBeforeCreated.toISOString(), accountId);

      expect(changedPatients[0]).toBe('10518e11-b9d2-4d74-9887-29eaae7b5938');
      expect(changedPatients.length).toBe(1);
    });

    test('should return no patients as patient hasn\'t been updated', async() => {
      const dateBeforeCreated = moment().add(1, 'days');
      await DeliveredProcedure.create(makeDeliveredProcedure());

      const changedPatients = await getPatientsWithChangedDueDateInfo(dateBeforeCreated.toISOString(), accountId);
      expect(changedPatients.length).toBe(0);
    });

    test('should return no patients as a new hygiene was created before the check date', async() => {
      const dateBeforeCreated = moment().subtract(1, 'days');
      await DeliveredProcedure.create(makeDeliveredProcedure());

      await sequelize.query(`UPDATE "Patients"
        SET "updatedAt" = '${moment().subtract(2, 'days').toISOString()}', "createdAt" = '${moment().subtract(2, 'days').toISOString()}'`);

      const changedPatients = await getPatientsWithChangedDueDateInfo(dateBeforeCreated.toISOString(), accountId);
      expect(changedPatients.length).toBe(0);
    });

    test.skip('should return one patients when dueForHygieneDate is in past', async() => {
      const dateBeforeCreated = moment().add(1, 'days');
      await DeliveredProcedure.create(makeDeliveredProcedure());

      await sequelize.query(`UPDATE "Patients"
        SET "updatedAt" = '${moment().subtract(2, 'days').toISOString()}', "createdAt" = '${moment().subtract(2, 'days').toISOString()}',
        "dueForHygieneDate" = '${moment().subtract(2, 'days').toISOString()}'`);

      const changedPatients = await getPatientsWithChangedDueDateInfo(dateBeforeCreated.toISOString(), accountId);
      expect(changedPatients.length).toBe(1);
    });

    test.skip('should return one patients when dueForRecallExamDate is in past', async() => {
      const dateBeforeCreated = moment().add(1, 'days');
      await DeliveredProcedure.create(makeDeliveredProcedure());

      await sequelize.query(`UPDATE "Patients"
        SET "updatedAt" = '${moment().subtract(2, 'days').toISOString()}', "createdAt" = '${moment().subtract(2, 'days').toISOString()}',
        "dueForRecallExamDate" = '${moment().subtract(2, 'days').toISOString()}'`);

      const changedPatients = await getPatientsWithChangedDueDateInfo(dateBeforeCreated.toISOString(), accountId);
      expect(changedPatients.length).toBe(1);
    });
  });

  describe('#updatePatientDueDate - returns an array of patient if a newer/updated/deleted from date from delivered procedures', () => {
    test('should be a function', () => {
      expect(typeof updatePatientDueDate).toBe('function');
    });

    beforeEach(async () => {
      await wipeAllModels();
      await seedTestUsers();
      await seedTestPatients();
      await seedTestPractitioners();
      await seedTestProcedures();
    });

    afterEach(async () => {
      await wipeModel(AppointmentCode);
      await wipeModel(Appointment);
      await wipeTestProcedures();
      await wipeAllModels();
    });

    test('should null out dueForRecallExamDate as the pending Appointment is gone', async() => {
      const date = new Date();

      await Patient.update({ dueForRecallExamDate: date }, {
        where: {
          id: patientId,
        },
      });

      const patientBefore = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      await updatePatientDueDate(accountId, [patientId]);

      const patientAfter = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      expect(patientBefore.dueForRecallExamDate.toISOString()).toBe(date.toISOString());
      expect(patientAfter.dueForRecallExamDate).toBe(null);
    });

    test('should null out dueForHygieneDate as the pending Appointment is gone - has pending appointment with different codes', async() => {
      const date = new Date();
      const lastHygieneDate = moment().subtract(6, 'months');

      await Patient.update({ dueForHygieneDate: date, lastHygieneDate }, {
        where: {
          id: patientId,
        },
      });

      const patientBefore = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      const appointment = await Appointment.create(makeApptData({
        startDate: '2019-07-20T00:14:30.932Z',
        endDate: '2019-07-20T00:15:30.932Z',
        isPending: true,
      }));

      await AppointmentCode.create({
        appointmentId: appointment.id,
        code: '11201',
      });

      await updatePatientDueDate(accountId, [patientId]);

      const patientAfter = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      expect(patientBefore.dueForHygieneDate.toISOString()).toBe(date.toISOString());
      expect(patientAfter.dueForHygieneDate).toBe(null);
    });


    test('should replace dueForHygieneDate as the pending Appointment has a hygiene code', async() => {
      const date = new Date();
      const lastHygieneDate = moment().subtract(6, 'months');

      await Patient.update({ dueForHygieneDate: date, lastHygieneDate }, {
        where: {
          id: patientId,
        },
      });

      const patientBefore = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      const appointment = await Appointment.create(makeApptData({
        startDate: '2019-07-20T00:14:30.932Z',
        originalDate: '2019-07-20T00:14:30.932Z',
        endDate: '2019-07-20T00:15:30.932Z',
        isPending: true,
      }));

      await AppointmentCode.create({
        appointmentId: appointment.id,
        code: '11101',
      });

      await updatePatientDueDate(accountId, [patientId]);

      const patientAfter = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      expect(patientBefore.dueForHygieneDate.toISOString()).toBe(date.toISOString());
      expect(patientAfter.dueForHygieneDate.toISOString()).toBe('2019-07-20T00:14:30.932Z');
    });

    test('should replace dueForRecallExamDate as the pending Appointment has a recall code', async() => {
      const date = new Date();
      const lastRecallDate = moment().subtract(6, 'months');

      await Patient.update({ dueForRecallExamDate: date, lastRecallDate }, {
        where: {
          id: patientId,
        },
      });

      const patientBefore = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      const appointment = await Appointment.create(makeApptData({
        startDate: '2019-07-20T00:14:30.932Z',
        originalDate: '2019-07-20T00:14:30.932Z',
        endDate: '2019-07-20T00:15:30.932Z',
        isPending: true,
      }));

      await AppointmentCode.create({
        appointmentId: appointment.id,
        code: '00121',
      });

      await updatePatientDueDate(accountId, [patientId]);

      const patientAfter = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      expect(patientBefore.dueForRecallExamDate.toISOString()).toBe(date.toISOString());
      expect(patientAfter.dueForRecallExamDate.toISOString()).toBe('2019-07-20T00:14:30.932Z');
    });

    test('should replace dueForRecallExamDate as the pending Appointment (earliest) has a recall code', async() => {
      const date = new Date();
      const lastRecallDate = moment().subtract(6, 'months');

      await Patient.update({ dueForRecallExamDate: date, lastRecallDate }, {
        where: {
          id: patientId,
        },
      });

      const patientBefore = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      const appointment2 = await Appointment.create(makeApptData({
        startDate: '2021-07-20T00:14:30.932Z',
        originalDate: '2021-07-20T00:14:30.932Z',
        endDate: '2021-07-20T00:15:30.932Z',
        isPending: true,
      }));

      await AppointmentCode.create({
        appointmentId: appointment2.id,
        code: '00121',
      });

      const appointment = await Appointment.create(makeApptData({
        startDate: '2019-07-20T00:14:30.932Z',
        originalDate: '2019-07-20T00:14:30.932Z',
        endDate: '2019-07-20T00:15:30.932Z',
        isPending: true,
      }));

      await AppointmentCode.create({
        appointmentId: appointment.id,
        code: '00121',
      });

      await updatePatientDueDate(accountId, [patientId]);

      const patientAfter = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      expect(patientBefore.dueForRecallExamDate.toISOString()).toBe(date.toISOString());
      expect(patientAfter.dueForRecallExamDate.toISOString()).toBe('2019-07-20T00:14:30.932Z');
    });

    test('should replace dueForRecallExamDate and dueForHygieneDate as both have a pending Appointment', async() => {
      const date = new Date();
      const lastRecallDate = moment().subtract(6, 'months');

      await Patient.update({
        dueForRecallExamDate: date,
        dueForHygieneDate: date,
        lastRecallDate,
        lastHygieneDate: lastRecallDate,
      }, {
        where: {
          id: patientId,
        },
      });

      const patientBefore = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      const appointment2 = await Appointment.create(makeApptData({
        startDate: '2021-07-20T00:14:30.932Z',
        originalDate: '2021-07-20T00:14:30.932Z',
        endDate: '2021-07-20T00:15:30.932Z',
        isPending: true,
      }));

      await AppointmentCode.create({
        appointmentId: appointment2.id,
        code: '00121',
      });

      const appointment = await Appointment.create(makeApptData({
        startDate: '2019-07-20T00:14:30.932Z',
        originalDate: '2019-07-20T00:14:30.932Z',
        endDate: '2019-07-20T00:15:30.932Z',
        isPending: true,
      }));

      await AppointmentCode.create({
        appointmentId: appointment.id,
        code: '11101',
      });

      await updatePatientDueDate(accountId, [patientId]);

      const patientAfter = await Patient.findOne({
        where: {
          id: patientId,
        },
      });

      expect(patientBefore.dueForHygieneDate.toISOString()).toBe(date.toISOString());
      expect(patientAfter.dueForHygieneDate.toISOString()).toBe('2019-07-20T00:14:30.932Z');
      expect(patientAfter.hygienePendingAppointmentId).toBe(appointment.id);
      expect(patientBefore.dueForRecallExamDate.toISOString()).toBe(date.toISOString());
      expect(patientAfter.dueForRecallExamDate.toISOString()).toBe('2021-07-20T00:14:30.932Z');
      expect(patientAfter.recallPendingAppointmentId).toBe(appointment2.id);

    });
  });
});

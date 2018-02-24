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
import { seedTestRecalls, recallId1, recallId2 } from '../../../_util/seedTestRecalls';
import { w2s } from '../../../../server/util/time';
import bumpPendingAppointment from '../../../../server/lib/correspondences/bumpPendingAppointment';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
  isRecall: true,
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

describe('Correspondence Note Generators', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    await seedTestRecalls();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  test('should return null as no pending appointment in future', async () => {
    const recalls = await Recall.bulkCreate([
      {
        accountId,
        primaryType: 'email',
        lengthSeconds: w2s(-1),
      },
    ]);

    const patients = await Patient.bulkCreate([
      makePatientData({
        firstName: 'Old',
        email: 'test@test.com',
        lastName: 'Patient',
        status: 'Active',
        lastHygieneDate: date(2016, 7, 5, 9),
      }),
    ]);

    const appointments = await Appointment.bulkCreate([
      makeApptData({
        patientId: patients[0].id,
        ...dates(2016, 7, 5, 9),
        isPending: true,
      }),
      makeApptData({
        patientId: patients[0].id,
        ...dates(2016, 7, 5, 9),
      }),
    ]);

    const sentRecalls = await SentRecall.bulkCreate([
      makeSentRecallData({
        appointmentId: appointments[1].id,
        recallId: recalls[0].id,
        patientId: patients[0].id,
        isSent: true,
      }),
    ]);

    expect(await bumpPendingAppointment(sentRecalls[0].id)).toBe(null);
  });

  test('should return first pending appointment as it\'s in future', async () => {
    const recalls = await Recall.bulkCreate([
      {
        accountId,
        primaryType: 'email',
        lengthSeconds: w2s(-1),
      },
    ]);

    const patients = await Patient.bulkCreate([
      makePatientData({
        firstName: 'Old',
        email: 'test@test.com',
        lastName: 'Patient',
        status: 'Active',
        lastHygieneDate: date(2016, 7, 5, 9),
      }),
    ]);

    const appointments = await Appointment.bulkCreate([
      makeApptData({
        patientId: patients[0].id,
        ...dates(2019, 7, 5, 9),
        isPending: true,
      }),
      makeApptData({
        patientId: patients[0].id,
        ...dates(2016, 7, 5, 9),
      }),
    ]);

    const sentRecalls = await SentRecall.bulkCreate([
      makeSentRecallData({
        appointmentId: appointments[1].id,
        recallId: recalls[0].id,
        patientId: patients[0].id,
        isSent: true,
      }),
    ]);

    expect(await bumpPendingAppointment(sentRecalls[0].id)).toBe(appointments[0].id);

    const resultAppointment = await Appointment.findOne({
      where: {
        id: appointments[0].id,
      },
    });

    expect(resultAppointment.startDate.toISOString()).toBe(date(2019, 7, 19, 9));
    expect(resultAppointment.endDate.toISOString()).toBe(date(2019, 7, 19, 10));
  });

  test('should return first pending appointment and not the future away as it\'s in future', async () => {
    const recalls = await Recall.bulkCreate([
      {
        accountId,
        primaryType: 'email',
        lengthSeconds: w2s(-1),
      },
    ]);

    const patients = await Patient.bulkCreate([
      makePatientData({
        firstName: 'Old',
        email: 'test@test.com',
        lastName: 'Patient',
        status: 'Active',
        lastHygieneDate: date(2016, 7, 5, 9),
      }),
    ]);

    const appointments = await Appointment.bulkCreate([
      makeApptData({
        patientId: patients[0].id,
        ...dates(2019, 7, 5, 9),
        isPending: true,
        isSyncedWithPms: true,
      }),
      makeApptData({
        patientId: patients[0].id,
        ...dates(2016, 7, 5, 9),
      }),
      makeApptData({
        patientId: patients[0].id,
        ...dates(2029, 7, 5, 9),
        isPending: true,
      }),
    ]);

    const sentRecalls = await SentRecall.bulkCreate([
      makeSentRecallData({
        appointmentId: appointments[1].id,
        recallId: recalls[0].id,
        patientId: patients[0].id,
        isSent: true,
      }),
    ]);

    expect(await bumpPendingAppointment(sentRecalls[0].id)).toBe(appointments[0].id);

    const resultAppointment = await Appointment.findOne({
      where: {
        id: appointments[0].id,
      },
    });
    expect(resultAppointment.isSyncedWithPms).toBe(false);
    expect(resultAppointment.startDate.toISOString()).toBe(date(2019, 7, 19, 9));
    expect(resultAppointment.endDate.toISOString()).toBe(date(2019, 7, 19, 10));
  });
});

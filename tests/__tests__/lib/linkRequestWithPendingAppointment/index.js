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
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import { seedTestRecalls, recallId1, recallId2 } from '../../../util/seedTestRecalls';
import { w2s } from '../../../../server/util/time';
import linkRequestWithPendingAppointment from '../../../../server/lib/linkRequestWithPendingAppointment';

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

describe('#linkRequestWithPendingAppointment', () => {
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

  test('should return empty object as no pending appointment in future', async () => {
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
        pmsId: '23',
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

    const result = await linkRequestWithPendingAppointment(sentRecalls[0].id);

    expect(result.note).toBe(undefined);
    expect(result.patientId).toBe(undefined);
    expect(result.suggestedChairId).toBe(undefined);
    expect(result.suggestedPractitionerId).toBe(undefined);
  });

  test('should return object with correct values of the first pending appointment as it\'s in future', async () => {
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
        pmsId: '23',
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

    const result = await linkRequestWithPendingAppointment(sentRecalls[0].id);

    const appointmentCheck = await Appointment.findOne({
      where: {
        id: appointments[0].id,
      },
    });

    expect(appointmentCheck.isSyncedWithPms).toBe(false);
    expect(appointmentCheck.isDeleted).toBe(true);
    expect(result.note).toBe(null);
    expect(result.patientId).toBe(patients[0].id);
    expect(result.suggestedChairId).toBe(null);
    expect(result.suggestedPractitionerId).toBe('497ff59a-4bae-4013-bdce-b6b5be91a1f5');
  });

  test('should return first appointment values of pending appointment and not the future away as it\'s in future', async () => {
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
        pmsId: '23',
        isSyncedWithPms: true,
      }),
      makeApptData({
        patientId: patients[0].id,
        ...dates(2016, 7, 5, 9),
      }),
      makeApptData({
        patientId: patients[0].id,
        pmsId: '24',
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

    const result = await linkRequestWithPendingAppointment(sentRecalls[0].id);

    expect(result.note).toBe(null);
    expect(result.patientId).toBe(patients[0].id);
    expect(result.suggestedChairId).toBe(null);
    expect(result.suggestedPractitionerId).toBe('497ff59a-4bae-4013-bdce-b6b5be91a1f5');

  });
});

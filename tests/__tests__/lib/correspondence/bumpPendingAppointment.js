
import {
  Appointment,
  Patient,
  Practitioner,
  Recall,
  SentRecall,
} from '../../../../server/_models';
import {
  getPatientsDueForRecall,
} from '../../../../server/lib/recalls/helpers';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import { seedTestRecalls, recallId1, recallId2 } from '../../../util/seedTestRecalls';
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

describe('#bumpPendingAppointment', () => {
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

  let recalls;
  let patients;
  let appointments;
  let sentRecalls;
  beforeEach(async () => {
    recalls = await Recall.bulkCreate([
      {
        accountId,
        primaryType: 'email',
        interval: '1 months',
      },
    ]);

    patients = await Patient.bulkCreate([
      makePatientData({
        firstName: 'Old',
        email: 'test@test.com',
        lastName: 'Patient',
        status: 'Active',
        dueForHygieneDate: date(2016, 7, 5, 9),
      }),
    ]);

    appointments = await Appointment.bulkCreate([
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

    await patients[0].update({ hygienePendingAppointmentId: appointments[0].id });

    sentRecalls = await SentRecall.bulkCreate([
      makeSentRecallData({
        recallId: recalls[0].id,
        patientId: patients[0].id,
        isSent: true,
        isHygiene: true,
      }),
    ]);
  });

  test('should return null if sentRecallId is null', async () => {
    expect(await bumpPendingAppointment(null)).toBe(null);
  });

  test('should return then pending appointment\'s id', async () => {
    expect(await bumpPendingAppointment(sentRecalls[0].id)).toBe(appointments[0].id);
  });
});

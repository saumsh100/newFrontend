
import * as reviewsFilterLibrary from '../../../../server/lib/patientsQuery/reviewsFilter';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  Account,
  Appointment,
  Patient,
  Practitioner,
  SentReview,
  Review,
} from '../../../../server/_models';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';

const makePatientData = (data = {}) => Object.assign({
  accountId,
}, data);

const makeApptData = (data = {}) => Object.assign({
  accountId,
  practitionerId,
}, data);

const makeSentReviewData = (data = {}) => Object.assign({
  accountId,
}, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => {
  return {
    startDate: date(y, m, d, h),
    endDate: date(y, m, d, h + 1),
  };
};

describe('Reviews Filter Tests', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  test('Should have 1 patient who has received a review between these dates', async () => {
    const patients = await Patient.bulkCreate([
      makePatientData({firstName: 'Old', lastName: 'Patient'}),
      makePatientData({firstName: 'Recent', lastName: 'Zatient'}),
    ]);

    const appointments = await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, ...dates(2000, 7, 5, 8) }),
      makeApptData({ patientId: patients[0].id, ...dates(2000, 8, 5, 9) }),
      makeApptData({ patientId: patients[1].id, ...dates(2000, 11, 5, 9) }),
    ]);

    await SentReview.bulkCreate([
      makeSentReviewData({
        patientId: patients[0].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 10, 10, 9),
      }),
      makeSentReviewData({
        patientId: patients[0].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 8, 10, 9),
      }),
      makeSentReviewData({
        patientId: patients[1].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 9, 10, 9),
      }),
    ]);

    const data = [date(2000, 7, 5, 8), date(2000, 12, 5, 8)];

    const patientsData = await reviewsFilterLibrary.ReviewsFilter({ data }, [], {}, accountId);
    expect(patientsData.rows.length).toBe(2);
  });
  test('Should have 1 patient who has received a review between these dates and ordered by lastName', async () => {
    const patients = await Patient.bulkCreate([
      makePatientData({firstName: 'Old', lastName: 'Patient'}),
      makePatientData({firstName: 'Recent', lastName: 'Katient'}),
      makePatientData({firstName: 'Very Old', lastName: 'Zatient'}),
    ]);

    const appointments = await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, ...dates(2000, 7, 5, 8) }),
      makeApptData({ patientId: patients[1].id, ...dates(2000, 8, 5, 9) }),
      makeApptData({ patientId: patients[2].id, ...dates(2000, 11, 5, 9) }),
    ]);

    await SentReview.bulkCreate([
      makeSentReviewData({
        patientId: patients[0].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 10, 10, 9),
      }),
      makeSentReviewData({
        patientId: patients[1].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 8, 10, 9),
      }),
      makeSentReviewData({
        patientId: patients[2].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 9, 10, 9),
      }),
    ]);

    const data = [date(2000, 7, 5, 8), date(2000, 12, 5, 8)];

    const query = {
      order: [['lastName', 'DESC']],
    };

    const patientsData = await reviewsFilterLibrary.ReviewsFilter({ data }, [], query, accountId);
    expect(patientsData.rows.length).toBe(3);
    expect(patientsData.rows[0].lastName).toBe('Zatient');
  });

});

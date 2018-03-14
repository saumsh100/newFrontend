
import * as reviewsFilterLibrary from '../../../../server/lib/patientsQuery/reviewsFilter';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  Appointment,
  Patient,
  Review,
} from '../../../../server/_models';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';

const makePatientData = (data = {}) => Object.assign({
  accountId,
}, data);

const makeApptData = (data = {}) => Object.assign({
  accountId,
  practitionerId,
}, data);

const makeReviewData = (data = {}) => Object.assign({
  accountId,
  stars: 3,
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

  test('Should have 1 patient who has received a review', async () => {
    const patients = await Patient.bulkCreate([
      makePatientData({ firstName: 'Old', lastName: 'Patient' }),
      makePatientData({ firstName: 'Recent', lastName: 'Zatient' }),
    ]);

    const appointments = await Appointment.bulkCreate([
      makeApptData({ patientId: patients[0].id, ...dates(2000, 7, 5, 8) }),
      makeApptData({ patientId: patients[0].id, ...dates(2000, 8, 5, 9) }),
      makeApptData({ patientId: patients[1].id, ...dates(2000, 11, 5, 9) }),
    ]);

    await Review.bulkCreate([
      makeReviewData({
        patientId: patients[0].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 10, 10, 9),
      }),
      makeReviewData({
        patientId: patients[0].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 8, 10, 9),
      }),
      makeReviewData({
        patientId: patients[1].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 9, 10, 9),
      }),
    ]);

    const data = [date(2000, 7, 5, 8), date(2000, 12, 5, 8)];

    const patientsData = await reviewsFilterLibrary.ReviewsFilter({ data }, [], {}, accountId);
    expect(patientsData.rows.length).toBe(2);
  });
  test('Should have 1 patient who has received a review, ordered by lastName', async () => {
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

    await Review.bulkCreate([
      makeReviewData({
        patientId: patients[0].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 10, 10, 9),
      }),
      makeReviewData({
        patientId: patients[1].id,
        appointmentId: appointments[0].id,
        createdAt: date(2000, 8, 10, 9),
      }),
      makeReviewData({
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

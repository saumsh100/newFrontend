
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import { Appointment, SentReminder } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import { accountId, seedTestUsers } from '../../_util/seedTestUsers';
import { patientId, seedTestPatients } from '../../_util/seedTestPatients';
import { reminderId1, seedTestReminders } from '../../_util/seedTestReminders';
import { appointmentId, seedTestAppointments } from '../../util/seedTestAppointments';
import { omitPropertiesFromBody } from '../../util/selectors';

const sentReminderId = 'e757afb0-14ef-4763-b162-c573169131c1';
const sentReminder = {
  id: sentReminderId,
  reminderId: reminderId1,
  accountId,
  patientId,
  appointmentId,
  isSent: true,
  lengthSeconds: 540,
  primaryType: 'email',
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestSentReminder() {
  await seedTestAppointments();
  await seedTestReminders();
  await wipeModel(SentReminder);
  await SentReminder.create(sentReminder);
}

describe('/api/sentReminders', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await seedTestUsers();
    await seedTestSentReminder();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('GET /', () => {
    test('retrieve sent reminder', () => {
      return request(app)
        .get('/api/sentReminders?join=appointment,reminder,patient')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

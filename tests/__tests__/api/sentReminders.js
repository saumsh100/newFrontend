
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { SentReminder, Reminder, Appointment, Patient } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { patientId } from '../../util/seedTestPatients';
import { reminderId1, seedTestReminders } from '../../util/seedTestReminders';
import { appointmentId, seedTestAppointments } from '../../util/seedTestAppointments';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/sentReminders';

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
  createdAt: new Date().toISOString(),
};

async function seedTestSentReminder() {
  await seedTestAppointments();
  await seedTestReminders();
  await SentReminder.create(sentReminder);
}

describe('/api/sentReminders', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(SentReminder);
    await seedTestUsers();
    await seedTestSentReminder();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });


  afterAll(async () => {
    await wipeModel(SentReminder);
    await wipeModel(Reminder);
    await wipeModel(Appointment);
    await wipeModel(Patient);
    await wipeTestUsers();
  });

  describe('GET /', () => {
    test('retrieve sent reminder', () => {
      return request(app)
        .get(`${rootUrl}?join=appointment,reminder,patient`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['homePhoneNumber', 'insurance', 'otherPhoneNumber', 'prefPhoneNumber', 'workPhoneNumber', 'createdAt']);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

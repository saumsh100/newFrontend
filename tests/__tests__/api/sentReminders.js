
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Appointment, SentReminder } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { patientId, seedTestPatients } from '../../util/seedTestPatients';
import { reminderId1, seedTestReminders } from '../../util/seedTestReminders';
import { appointmentId, seedTestAppointments } from '../../util/seedTestAppointments';

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
  await seedTestPatients();
  await seedTestReminders();
  await wipeModel(SentReminder);
  await SentReminder.save(sentReminder);
}

describe('/api/sentReminders', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestSentReminder();
    });

    test('retrieve sent reminder', () => {
      return request(app)
        .get('/api/sentReminders?join=appointment')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
          joinObject: {
            appointment: true,
          },
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });


  });
});


import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Appointment, Practitioner, SentReminder } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, managerUserId, seedTestUsers } from '../../util/seedTestUsers';
import { patientId, seedTestPatients } from '../../util/seedTestPatients';
import { reminderId1, seedTestReminders } from '../../util/seedTestReminders';

const sentReminderId = 'e757afb0-14ef-4763-b162-c573169131c1';
const appointmentId = '6b215a42-5c33-4f94-8313-d89893ae2f36';
const practitionerId = '497ff59a-4bae-4013-bdce-b6b5be91a1f5';

const practitioner = {
  id: practitionerId,
  accountId,
  firstName: 'Colonel',
  lastName: 'Sanders',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const appointment = {
  id: appointmentId,
  startDate: '2017-07-25T00:14:30.932Z',
  endDate: '2017-07-19T00:16:30.932Z',
  accountId,
  practitionerId,
  isSyncedWithPMS: false,
  isReminderSent: true,
  isDeleted: false,
  createdAt: '2017-07-19T00:14:30.932Z',
};

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

async function seedTestPractitioner() {
  await wipeModel(Practitioner);
  await Practitioner.save(practitioner);
}

async function seedTestAppointment() {
  await seedTestPractitioner();
  await wipeModel(Appointment);
  await Appointment.save(appointment);
}

async function seedTestSentReminder() {
  await seedTestAppointment();
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

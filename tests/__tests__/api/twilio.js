
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

const rootUrl = '/_twilio';

const sentReminderId = 'e757afb0-14ef-4763-b162-c573169131c1';
const sentReminder = {
  id: sentReminderId,
  reminderId: reminderId1,
  accountId,
  patientId,
  appointmentId,
  isSent: true,
  lengthSeconds: 540,
  primaryType: 'sms',
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestSentReminder() {
  await seedTestAppointments();
  await seedTestReminders();
  await SentReminder.create(sentReminder);
}

describe('/_twilio/', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(SentReminder);
    await seedTestUsers();
    await seedTestSentReminder();
    await Patient.update({ mobilePhoneNumber: '+12222222222' }, { where: { id: '10518e11-b9d2-4d74-9887-29eaae7b5938' } });
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });


  afterAll(async () => {
    await wipeModel(SentReminder);
    await wipeModel(Reminder);
    await wipeModel(Appointment);
    await wipeModel(Patient);
    await wipeAllModels();
    await wipeTestUsers();
  });


  describe('POST /', () => {
    test.skip('Receive SMS', () => {
      return request(app)
        .post(`${rootUrl}/sms/accounts/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          sid: 'asdasds',
          To: '+12222222222',
          From: '+12222222222',
          Body: 'asdsad',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['homePhoneNumber', 'insurance', 'otherPhoneNumber', 'prefPhoneNumber', 'workPhoneNumber']);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

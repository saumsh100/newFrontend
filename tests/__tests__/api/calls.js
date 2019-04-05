
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Call, Patient, Account } from '../../../server/_models';
import wipeModel from '../../util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { patient, patientId, seedTestPatients, wipeTestPatients } from '../../util/seedTestPatients';
import { omitPropertiesFromBody } from '../../util/selectors';

const chatId = '3180a744-f6b0-4a09-8046-4e713bf5b565';
const textMessageId = '059987cb-3051-4656-98d0-72cda34d32a6';
const patientPhoneNumber = '+16045555555';
const clinicPhone = '+16043333333';

const rootUrl = '/api/calls';

const call = {
  id: 'asdsads',
  accountId,
  startTime: '2017-08-10T22:54:00.569Z',
  answered: true,
  callSource: 'direct',
  wasApptBooked: true,
  destinationNum: '+16041234567',
};

const textMessage = {
  id: textMessageId,
  chatId,
  to: patientPhoneNumber,
  from: clinicPhone,
  body: 'This is a test text message',
  createdAt: '2017-07-19T00:14:30.932Z',
  userId: '6668f250-e8c9-46e3-bfff-0249f1eec6b8',
};

async function seedTestCalls() {
  await wipeModel(Call);
  await wipeModel(Patient);
  await seedTestPatients();
  await Call.create(call);
}

describe('/api/calls', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(Call);
    await wipeTestPatients();
    await wipeTestUsers();
  });

  describe('GET /', () => {
    beforeAll(async () => {
      await seedTestCalls();
    });

    test('/ - get chats stats', () => {
      return request(app)
        .get(`${rootUrl}/stats?startDate=2017-07-09T22:54:00.569Z&endDate=2017-08-13T22:54:00.569Z`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['lastTextMessageId']);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - get chats', () => {
      return request(app)
        .get(`${rootUrl}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['lastTextMessageId']);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - get graph stats 400 as no dates provided', () => {
      return request(app)
        .get(`${rootUrl}/statsgraph`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    test('/ - get graph stats', () => {
      return request(app)
        .get(`${rootUrl}/statsgraph?startDate=2017-07-09T22:54:00.569Z&endDate=2017-08-13T22:54:00.569Z`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['lastTextMessageId']);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - get graph stats. Fail due to a bad date', () => {
      return request(app)
        .get(`${rootUrl}/statsgraph?startDate=2017-07-9T22:54:00.569Z&endDate=2017-08-13T22:54:00.569Z`)
        .set('Authorization', `Bearer ${token}`)
        .expect(500);
    });
  });

  describe('PUT /', () => {
    beforeAll(async () => {
      await seedTestCalls();
    });

    test('/ - put chats', () => {
      return request(app)
        .put(`${rootUrl}/asdsads`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          wasApptBooked: false,
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['lastTextMessageId']);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

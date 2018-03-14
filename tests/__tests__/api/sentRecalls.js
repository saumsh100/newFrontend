
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { SentRecall, Recall, Patient } from '../../../server/_models';
import wipeModel from '../../util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { patientId, seedTestPatients } from '../../util/seedTestPatients';
import { recallId1, seedTestRecalls } from '../../util/seedTestRecalls';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/sentRecalls';

const sentRecallId = '689b7e40-0bff-40ea-bdeb-ff08d055075f';
const sentRecall = {
  id: sentRecallId,
  recallId: recallId1,
  accountId,
  patientId,
  lengthSeconds: 540,
  isSent: true,
  primaryType: 'sms',
  createdAt: new Date().toISOString(),
};

async function seedTestSentRecall() {
  await seedTestPatients();
  await seedTestRecalls();
  await SentRecall.create(sentRecall);
}

describe('/api/sentRecalls', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(SentRecall);
    await seedTestUsers();
    await seedTestSentRecall();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(SentRecall);
    await wipeModel(Recall);
    await wipeModel(Patient);
    await wipeTestUsers();
  });

  describe('GET /', () => {
    test('retrieve sent recall', () => {
      return request(app)
        .get(`${rootUrl}?join=recall,patient`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['homePhoneNumber', 'insurance', 'otherPhoneNumber', 'prefPhoneNumber', 'workPhoneNumber', 'createdAt']);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

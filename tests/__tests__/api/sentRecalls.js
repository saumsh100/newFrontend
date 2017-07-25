
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { SentRecall } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { patientId, seedTestPatients } from '../../util/seedTestPatients';
import { recallId1, seedTestRecalls } from '../../util/seedTestRecalls';
import { omitPropertiesFromBody } from '../../util/selectors';

const sentRecallId = '689b7e40-0bff-40ea-bdeb-ff08d055075f';
const sentRecall = {
  id: sentRecallId,
  recallId: recallId1,
  accountId,
  patientId,
  lengthSeconds: 540,
  primaryType: 'sms',
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestSentRecall() {
  await seedTestRecalls();
  await seedTestPatients();
  await wipeModel(SentRecall);
  SentRecall.save(sentRecall);
}

describe('/api/sentRecalls', () => {
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
      await seedTestSentRecall();
    });

    test('retrieve sent recall', () => {
      return request(app)
        .get('/api/sentRecalls?join=recall,patient')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

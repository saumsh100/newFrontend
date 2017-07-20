
import request from 'supertest';
import app from '../../../server/bin/app';
import {
  Account,
  Recall,
} from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import seedTestUsers from '../../util/seedTestUsers';
import generateToken from '../../util/generateToken';
import { getModelsArray } from '../../util/selectors';

const rootUrl = '/api/accounts';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const recallId1 = 'd5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const recallId2 = 'e5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const newRecallId = 'f5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

async function seedRecalls() {
  await wipeModel(Recall);

  // seed recalls
  await Recall.save([
    {
      id: recallId1,
      accountId,
      primaryType: 'sms',
      createdAt: '2017-07-19T00:14:30.932Z',
    },
    {
      id: recallId2,
      accountId,
      primaryType: 'sms',
      createdAt: '2017-07-19T00:14:30.932Z',
    },
  ]);
}

describe('/api/accounts/:account/recalls', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();

    // Seed an extra account for fetching multiple and testing switching
    await Account.save({
      id: accountId2,
      enterpriseId,
      name: 'Test Account 2',
      createdAt: '2017-07-20T00:14:30.932Z',
    });

    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Recalls', () => {
    beforeAll(async () => {
      await seedRecalls();
    });

    describe('GET /:accountId/recalls', () => {
      test('should fetch all recalls for the account', () => {
        return request(app)
          .get(`${rootUrl}/${accountId}/recalls`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(({ body }) => {
            const recalls = getModelsArray('recalls', body);
            expect(recalls.length).toBe(2);
            expect(body).toMatchSnapshot();
          });
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .get(`${rootUrl}/${accountId2}/recalls`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('POST /:accountId/recalls', () => {
      test('should create a recall for the account', () => {
        return request(app)
          .post(`${rootUrl}/${accountId}/recalls`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            id: newRecallId,
            primaryType: 'sms',
            createdAt: '2017-07-19T00:14:30.932Z',
          })
          .expect(200)
          .then(({ body }) => {
            const recalls = getModelsArray('recalls', body);
            expect(recalls.length).toBe(1);
            expect(body).toMatchSnapshot();
          });
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .post(`${rootUrl}/${accountId2}/recalls`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('PUT /:accountId/recalls/:recallId', () => {
      test('should update a recall for the account', () => {
        return request(app)
          .put(`${rootUrl}/${accountId}/recalls/${recallId1}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            id: newRecallId,
            primaryType: 'phone',
            createdAt: '2017-07-19T00:14:30.932Z',
          })
          .expect(200)
          .then(({ body }) => {
            const recalls = getModelsArray('recalls', body);
            const [recall] = recalls;
            expect(recalls.length).toBe(1);
            expect(recall.primaryType).toBe('phone');
            expect(body).toMatchSnapshot();
          });
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .put(`${rootUrl}/${accountId2}/recalls/${recallId1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('DELETE /:accountId/recalls/:recallId', () => {
      afterEach(async () => {
        // have to restore recalls cause these routes could delete
        await seedRecalls();
      });

      test('should delete a recall for the account', () => {
        return request(app)
          .delete(`${rootUrl}/${accountId}/recalls/${recallId1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204);
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .delete(`${rootUrl}/${accountId2}/recalls/${recallId1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });

});

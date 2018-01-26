import request from 'supertest';
import app from '../../../server/bin/app';
import { Account, Recall, Address } from '../../../server/_models';
import wipeModel from '../../_util/wipeModel';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import { recallId1, seedTestRecalls } from '../../_util/seedTestRecalls';
import generateToken from '../../_util/generateToken';
import { getModelsArray, omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/accounts';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const addressId = 'd94894b1-84ec-492c-a33e-3f1ad61b9c1c';

const newRecallId = 'f5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const address = {
  id: addressId,
  country: 'CA',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

describe('/api/accounts/:account/recalls', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await seedTestUsers();

    // Seed an extra account for fetching multiple and testing switching
    await Address.create(address);

    await Account.create({
      id: accountId2,
      addressId,
      enterpriseId,
      name: 'Test Account 2',
      createdAt: '2017-07-20T00:14:30.932Z',
    });

    await wipeModel(Recall);
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(Recall);
    await wipeTestUsers();
  });

  describe('Recalls', () => {
    beforeEach(async () => {
      await seedTestRecalls();
    });

    describe('GET /:accountId/recalls', () => {
      test('should fetch all recalls for the account', () => {
        return request(app)
          .get(`${rootUrl}/${accountId}/recalls`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
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
            primaryTypes: ['sms'],
            interval: '-2 months',
            createdAt: '2017-07-19T00:14:30.932Z',
          })
          .expect(201)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
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
            primaryTypes: ['phone'],
            createdAt: '2017-07-19T00:14:30.932Z',
          })
          .expect(200)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
            const recalls = getModelsArray('recalls', body);
            const [recall] = recalls;
            expect(recalls.length).toBe(1);
            expect(recall.primaryTypes).toEqual(['phone']);
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
        await seedTestRecalls();
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

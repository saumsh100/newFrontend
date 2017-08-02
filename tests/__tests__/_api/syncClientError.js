
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import { SyncClientError } from '../../../server/_models';
import wipeModel from '../../_util/wipeModel';
import { accountId, seedTestUsers } from '../../_util/seedTestUsers';
import { omitPropertiesFromBody, omitProperties }  from '../../util/selectors';

const syncClientErrorId = '805b682b-1dc9-43cb-8026-90481429875c';
const syncClientError = {
  id: syncClientErrorId,
  syncId: 1,
  accountId,
  version: 'a',
  adapter: 'b',
  operation: 'sync',
  success: true,
  model: 'Appointment',
  documentId: 'c',
  payload: 'd',
  customErrorMsg: 'Custom Error message',
  errorMessage: 'Error message',
  stackTrace: 'Stack trace',
  createdAt: '2017-07-19T00:14:30.932Z',
};

const rootUrl = '/_api/syncClientError';

async function seedTestSyncClientError() {
  await wipeModel(SyncClientError);
  await SyncClientError.create(syncClientError);
}

describe('/api/syncClientError', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(SyncClientError);
    await seedTestUsers();
    await seedTestSyncClientError();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(SyncClientError);
  });

  describe('GET /', () => {
    test('/ - get all errors for account', () => {
      return request(app)
        .get(`${rootUrl}?accountId=${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeModel(SyncClientError);
    });


    test('/ - create an error', () => {
     return request(app)
     .post(`${rootUrl}`)
     .set('Authorization', `Bearer ${token}`)
     .send(syncClientError)
     .expect(201)
     .then(({ body }) => {
       body = omitPropertiesFromBody(body);
       body = omitProperties(body);
       expect(body).toMatchSnapshot();
     });
    });

  });

});


import request from 'supertest';
import app from '../../../server/bin/app';
import {
  Account,
  Invite,
  Address,
} from '../../../server/_models';
import { accountId, enterpriseId, ownerUserId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import generateToken from '../../_util/generateToken';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import { getModelsArray, omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/accounts';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const inviteId1 = '23d4e661-1155-4494-8fdb-c4ec0ddf804d';
const inviteId2 = '46d4e661-1155-4494-8fdb-c4ec0ddf804d';
const newInviteId = '11d4e661-1155-4494-8fdb-c4ec0ddf804d';
const token1 = '6778f250-e8c9-46e3-bfff-0249f1eec6b8';
const token2 = '8998f250-e8c9-46e3-bfff-0249f1eec6b8';
const addressId = 'd94894b1-84ec-492c-a33e-3f1ad61b9c1c';

const address = {
  id: addressId,
  country: 'CA',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

async function seedData() {
  // Seed an extra account for fetching multiple and testing switching

  Address.create(address);
  await Account.create({
    id: accountId2,
    addressId,
    enterpriseId,
    name: 'Test Account 2',
    createdAt: '2017-07-20T00:14:30.932Z',
  });
}

async function seedInvites() {
  await Invite.bulkCreate([
    {
      id: inviteId1,
      createdAt: '2017-07-20T00:14:30.932Z',
      sendingUserId: ownerUserId,
      accountId,
      email: 'invite@test.com',
      token: token1,
      enterpriseId,
    },
    {
      id: inviteId2,
      createdAt: '2017-07-20T00:14:30.932Z',
      sendingUserId: ownerUserId,
      accountId,
      email: 'invite@test.com',
      token: token2,
      enterpriseId,
    },
  ]);
}

describe('/api/accounts/:accountId/invites', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(Invite);
    await seedTestUsers();
    await seedData();
    await seedInvites();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(Invite);
    await wipeTestUsers();
    await wipeModel(Account);
  });

  describe('GET /api/accounts/:accountId/invites', () => {
    test('should fetch 2 invites', async () => {
      return request(app)
        .get(`${rootUrl}/${accountId}/invites`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });


  describe('POST /api/accounts/:accountId/invites', () => {
    beforeEach(async() => {
      await wipeModel(Invite);
    });

    test('should create an invite', async () => {
      const ownerToken = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' })
      return request(app)
        .post(`${rootUrl}/${accountId}/invites`)
        .send({
          id: newInviteId,
          createdAt: '2017-07-20T00:14:30.932Z',
          sendingUserId: ownerUserId,
          accountId,
          email: 'invite@test.com',
          token: token1,
          enterpriseId,
        })
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const [invite] = getModelsArray('invites', body);
          delete invite.token;
          expect(invite).toMatchSnapshot();
        });
    });


    test('should fail if required info is not there', async () => {
      const ownerToken = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' });
      return request(app)
        .post(`${rootUrl}/${accountId}/invites`)
        .send({
          id: newInviteId,
          createdAt: '2017-07-20T00:14:30.932Z',
          sendingUserId: ownerUserId,
          accountId,
          // Don't give email cause it's required
          // email: 'invite@test.com',
          token: token1,
          enterpriseId,
        })
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(500);
    });
  });

  describe('DELETE /:accountId/invites/:inviteId', () => {
    test('should delete an invite', () => {
      return request(app)
        .delete(`${rootUrl}/${accountId}/invites/${inviteId1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    test('should not allow the user to delete an invite', () => {
      return request(app)
        .delete(`${rootUrl}/${accountId2}/invites/${inviteId1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('POST /signup/:token', () => {

    test('should create a User', async () => {
      return request(app)
        .post(`/_signup/${token2}/`)
        .send({
          firstName: 'Why',
          lastName: '?',
          username: 'invite@test.com',
          password: 'thisisatest',
          confirmPassword: 'thisisatest',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.token).not.toBeNull();
        });
    });
  });

});

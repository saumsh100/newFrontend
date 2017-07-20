
import request from 'supertest';
import app from '../../../server/bin/app';
import {
  Account,
  Invite,
} from '../../../server/models';
import seedTestUsers from '../../util/seedTestUsers';
import generateToken from '../../util/generateToken';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { getModelsArray }  from '../../util/selectors';

const rootUrl = '/api/accounts';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const inviteId1 = '23d4e661-1155-4494-8fdb-c4ec0ddf804d';
const inviteId2 = '46d4e661-1155-4494-8fdb-c4ec0ddf804d';
const newInviteId = '11d4e661-1155-4494-8fdb-c4ec0ddf804d';
const ownerUserId = '5668f250-e8c9-46e3-bfff-0249f1eec6b8';
const token1 = '6778f250-e8c9-46e3-bfff-0249f1eec6b8';
const token2 = '8998f250-e8c9-46e3-bfff-0249f1eec6b8';

async function seedData() {
  await seedTestUsers();

  // Seed an extra account for fetching multiple and testing switching
  await Account.save({
    id: accountId2,
    enterpriseId,
    name: 'Test Account 2',
    createdAt: '2017-07-20T00:14:30.932Z',
  });
}

async function seedInvites() {
  await wipeModel(Invite);
  await Invite.save([
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
  beforeAll(async () => {
    await seedData();
    await seedInvites();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('GET /api/accounts/:accountId/invites', () => {
    test('should fetch 2 invites', async () => {
      return request(app)
        .get(`${rootUrl}/${accountId}/invites`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /api/accounts/:accountId/invites', () => {
    afterAll(async () => {
      await seedInvites();
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
    afterEach(async () => {
      await seedInvites();
    });

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
});

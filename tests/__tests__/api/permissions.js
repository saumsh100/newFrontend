
import request from 'supertest';
import app from '../../../server/bin/app';
import {
  Account,
} from '../../../server/models';
import { accountId, enterpriseId, seedTestUsers } from '../../util/seedTestUsers';
import generateToken from '../../util/generateToken';
import { wipeAllModels } from '../../util/wipeModel';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/api/accounts';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const permissionId = '84d4e661-1155-4494-8fdb-c4ec0ddf804d';

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

describe('/api/accounts/:accountId/permissions', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedData();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('PUT /api/accounts/:accountId/permissions/:permissionId', () => {
    test('should update the permission object', async () => {
      const superAdminToken = await generateToken({ username: 'superadmin@test.com', password: '!@CityOfBudaTest#$' })
      return request(app)
        .put(`${rootUrl}/${accountId}/permissions/${permissionId}`)
        .send({ role: 'ADMIN' })
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('should return 403', async () => {
      return request(app)
        .put(`${rootUrl}/${accountId}/permissions/${permissionId}`)
        .send({ role: 'ADMIN' })
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });
});

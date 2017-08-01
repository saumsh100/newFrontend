
import request from 'supertest';
import app from '../../../server/bin/app';
import {
  Account,
} from '../../../server/_models';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import generateToken from '../../_util/generateToken';
import { wipeModel } from '../../_util/wipeModel';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/accounts';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const permissionId = '84d4e661-1155-4494-8fdb-c4ec0ddf804d';

async function seedData() {
  await wipeTestUsers();
  await seedTestUsers();

  // Seed an extra account for fetching multiple and testing switching
  await Account.create({
    id: accountId2,
    enterpriseId,
    name: 'Test Account 2',
    createdAt: '2017-07-20T00:14:30.932Z',
  });
}

describe('/api/accounts/:accountId/permissions', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await seedData();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeTestUsers();
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

    test('should return 403', () => {
      return request(app)
        .put(`${rootUrl}/${accountId}/permissions/${permissionId}`)
        .send({ role: 'ADMIN' })
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });
});

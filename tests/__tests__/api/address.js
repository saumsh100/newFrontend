
import request from 'supertest';
import app from '../../../server/bin/app';
import {
  Account,
  WeeklySchedule,
  Address,
} from '../../../server/_models';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import generateToken from '../../util/generateToken';
import { getModelsArray, omitPropertiesFromBody, omitProperties } from '../../util/selectors';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';

const rootUrl = '/_api/addresses';
const addressId = '62954241-3652-4792-bae5-5bfed53d37b7';
const addressId2 = 'd94894b1-84ec-492c-a33e-3f1ad61b9c1c';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const permissionId = '84d4e661-1155-4494-8fdb-c4ec0ddf804d';
const userId = '72954241-3652-4792-bae5-5bfed53d37b7';

const address = {
  id: addressId,
  country: 'CA',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

async function seedData() {
  await seedTestUsers();

  // Seed an extra account for fetching multiple and testing switching
  await Address.create(address);
  await Account.create({
    id: accountId2,
    addressId: '62954241-3652-4792-bae5-5bfed53d37b7',
    enterpriseId,
    name: 'Test Account 2',
    createdAt: '2017-07-20T00:14:30.932Z',
  });
}

describe('/api/addresses', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedData();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(WeeklySchedule);
    await wipeModel(Address);
    await wipeTestUsers();
    await wipeAllModels();
  });

  describe('POST /', () => {
    test('should create an address and return the account with address', async () => {
      const superAdminToken = await generateToken({ username: 'superadmin@test.com', password: '!@CityOfBudaTest#$' })
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: addressId2,
          country: 'CA',
          street: '213292',
          city: 'Belgrade',
          zipCode: 'v3m2m2',
          state: 'BC',
          timezone: 'America/Adak',
          accountId: '52954241-3652-4792-bae5-5bfed53d37b7',
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    describe('PUT /:addressId', () => {
      test('should update the address', () => {
        const city = 'Test That Thang';
        return request(app)
          .put(`${rootUrl}/${addressId2}`)
          .send({ city })
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
            expect(body).toMatchSnapshot();
          });
      });
    });
  });


});

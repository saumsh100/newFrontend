
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Family } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { omitPropertiesFromBody } from '../../util/selectors';

const familyId = '08cb4f5a-3d19-4f70-a543-ab961e78200c';
const batchInvalidFamilyId = 'b39f60fe-820b-40a3-beb7-00a3aa8ff689'
const batchFamilyId = '215d8818-0130-411b-bd55-c04587892b66';
const batchFamilyId2 = 'd0ce4957-dd00-4eab-9517-ca505e9a5c2a';
const batchFamilyId3 = '582d3ed0-f269-4c07-9d12-b7034442a093';
const batchFamilyId4 = '04b87850-27f1-4ce0-9874-9243ed68a429';

const family = {
  id: familyId,
  accountId,
};

const batchFamily = {
  id: batchFamilyId,
  accountId,
};

const batchFamily2 = {
  id: batchFamilyId2,
  accountId,
};

const batchFamily3 = {
  id: batchFamilyId3,
  accountId,
};

const batchFamily4 = {
  id: batchFamilyId4,
  accountId,
};

const batchInvalidFamily = {
  id: batchInvalidFamilyId,
  accountId,
  pmsId: 9,
};

async function seedTestFamilies() {
  await wipeModel(Family);
  Family.save(family);
}

describe('/api/families', () => {
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
      await seedTestFamilies();
    });

    test('/ - get all family info for account', () => {
      return request(app)
        .get('/api/families/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:familyId - retrieve family', () => {
      return request(app)
        .get(`/api/families/${familyId}`)
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
      await wipeModel(Family);
    });

    test('/ - create a family', () => {
      return request(app)
        .post('/api/families')
        .set('Authorization', `Bearer ${token}`)
        .send(family)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/batch - 4 families created successfully', () => {
      return request(app)
        .post('/api/families/batch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          families: [batchFamily, batchFamily2, batchFamily3, batchFamily4],
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.families).length).toBe(4);
        });
    });

    test('/batch - 1 invalid family, 3 valid families', () => {
      return request(app)
        .post('/api/families/batch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          families: [batchInvalidFamily, batchFamily2, batchFamily3, batchFamily4],
        })
        .expect(400)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.families).length).toBe(3);
        });
    });

  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestFamilies();
    });

    test('/:familyId - update family', () => {
      return request(app)
        .put(`/api/families/${familyId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          pmsId: 'test',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestFamilies();
    });

    test('/:familyId - delete family', () => {
      return request(app)
        .delete(`/api/families/${familyId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

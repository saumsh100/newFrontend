
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Service } from '../../../server/models';
import { Practitioner } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';

const serviceId = 'c5beec65-73a0-4b58-ba48-65986931d054';
const practitionerId = '87821f00-ce49-4112-b378-2a3fa9188d16';

const service = {
  id: serviceId,
  name: 'Test Service',
  accountId,
  duration: 4,
  createdAt: '2017-07-19T00:14:30.932Z',
};

const practitioner = {
  id: practitionerId,
  firstName: 'Test',
  lastName: 'Practitioner',
  accountId,
};

async function seedTestService() {
  await wipeModel(Service);
  await wipeModel(Practitioner);
  await Practitioner.save(practitioner);
  await Service.save(service);
};

describe('/api/services', () => {
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
      await seedTestService();
    });

    test('retrieve services', () => {
      return request(app)
        .get('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });

    test('/:serviceId - retrieve a service', () => {
      return request(app)
        .get(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeModel(Service);
    });

    test('create service', () => {
      return request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .send(service)
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestService();
    });

    test('/:serviceId - update service', () => {
      return request(app)
        .put(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Test Service',
          practitioners: ['87821f00-ce49-4112-b378-2a3fa9188d16']
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });

    test('/:serviceId - join practitioners', () => {
      return request(app)
        .get('/api/services?join=practitioners')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestService();
    });

    test('/:serviceId - delete service', () => {
      return request(app)
        .delete(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });
});

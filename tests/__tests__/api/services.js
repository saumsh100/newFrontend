
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Service } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';

import { serviceId, service, seedTestService } from '../../util/seedTestServices';
import { practitionerId, seedTestPractitioners } from '../../util/seedTestPractitioners';

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
      await seedTestPractitioners();
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
          practitioners: [practitionerId],
        })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('JOIN /', () => {
    beforeEach(async () => {
      await seedTestService();
    });

    test('join practitioners', () => {
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

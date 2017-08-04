
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import { Service, WeeklySchedule, Practitioner, Account } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import { accountId, seedTestUsers } from '../../_util/seedTestUsers';

const rootUrl = '/_api/services';

import { serviceId, service, seedTestService } from '../../_util/seedTestServices';

import { practitionerId, seedTestPractitioners } from '../../_util/seedTestPractitioners';

import { omitPropertiesFromBody } from '../../util/selectors';


describe('/api/services', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(WeeklySchedule);
    await wipeModel(Practitioner);
    await wipeModel(Account);
    await wipeAllModels();
  });

  describe('GET /', () => {
    beforeAll(async () => {
      // await seedTestService();
      await seedTestPractitioners();
    });

    test('retrieve services', () => {
      return request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:serviceId - retrieve a service', () => {
      return request(app)
        .get(`${rootUrl}/1f439ff8-c55d-4423-9316-a41240c4d329`)
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
      await wipeModel(Service);
    });

    test('create service', () => {
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(service)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
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
        .put(`${rootUrl}/${serviceId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          isDefault: true,
          name: 'Updated Test Service',
          practitioners: [practitionerId],
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['id', 'Practitioner_Service']);
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
        .get(`${rootUrl}?join=practitioners`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
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
      await seedTestService();
    });

    test('/:serviceId - delete service', () => {
      return request(app)
        .delete(`${rootUrl}/${serviceId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

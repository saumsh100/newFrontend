
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Request } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { serviceId, seedTestService } from '../../util/seedTestServices';
import { patientUserId, seedTestPatients } from '../../util/seedTestPatients';
import { appointmentId, seedTestAppointments } from '../../util/seedTestAppointments';
import { omitPropertiesFromBody } from '../../util/selectors';

const requestId = '272d86fc-f743-4cd6-b0c8-7906959bcc9f';
const requestSeed = {
  id: requestId,
  startDate: '2017-07-19T00:16:30.932Z',
  endDate: '2017-07-19T00:17:30.932Z',
  patientUserId,
  accountId,
  serviceId,
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestRequest() {
  await seedTestAppointments();
  await seedTestService();
  await seedTestPatients();
  await wipeModel(Request);
  Request.save(requestSeed);
}

describe('/api/requests', () => {
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
      await seedTestRequest();
    });

    test('get all requests', () => {
      return request(app)
        .get('/api/requests')
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

    test('get all requests with patientUsers and services', () => {
      return request(app)
        .get('/api/requests?join=patientUser,service')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['password']);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeModel(Request);
    });

    test('create request', () => {
      return request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${token}`)
        .send(requestSeed)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestRequest();
    });

    test('/:requestId - update request', () => {
      return request(app)
        .put(`/api/requests/${requestId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          endDate: '2017-07-19T00:18:30.932Z',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:requestId - reject request', () => {
      return request(app)
        .put(`/api/requests/${requestId}/reject`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    // TODO: Ask someone if this response is supposed to be an empty object
    test('/:requestId/confirm/:appointmentId - send confirmed request email', () => {
      return request(app)
        .put(`/api/requests/${requestId}/confirm/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestRequest();
    });

    test('/:requestId - delete a request', () => {
      return request(app)
        .delete(`/api/requests/${requestId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});


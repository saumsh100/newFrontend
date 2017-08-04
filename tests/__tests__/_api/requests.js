
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import { Request, Appointment, PatientUser, Patient, Service } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../_util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import { serviceId, seedTestService } from '../../_util/seedTestServices';
import { patientUserId, seedTestPatients } from '../../_util/seedTestPatients';
import { appointmentId, seedTestAppointments } from '../../_util/seedTestAppointments';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/requests';

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
  await Request.create(requestSeed);
}

describe('/api/requests', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(Request)
    await seedTestUsers();
    await seedTestRequest();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(Request);
    await wipeModel(Service);
    await wipeModel(Appointment);
    await wipeModel(PatientUser);
    await wipeTestUsers();
  });

  describe('GET /', () => {
    test('get all requests', () => {
      return request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('get all requests with patientUsers and services', () => {
      return request(app)
        .get(`${rootUrl}?join=patientUser,service`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['password', 'avatarUrl', 'patientUserId']);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async() => {
      await wipeModel(Request)
    });

    test('create request', () => {
      return request(app)
        .post(rootUrl)
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
    test('/:requestId - update request', () => {
      return request(app)
        .put(`${rootUrl}/${requestId}`)
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
        .put(`${rootUrl}/${requestId}/reject`)
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

    //Use mandrill api key

    test('/:requestId/confirm/:appointmentId - send confirmed request email', () => {
      return request(app)
        .put(`${rootUrl}/${requestId}/confirm/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    test('/:requestId - delete a request', () => {
      return request(app)
        .delete(`${rootUrl}/${requestId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});


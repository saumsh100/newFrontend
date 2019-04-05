
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Request, Appointment, PatientUser, Patient, Service, Chair } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { serviceId, seedTestService } from '../../util/seedTestServices';
import { patientUserId, seedTestPatients } from '../../util/seedTestPatients';
import { appointmentId, seedTestAppointments } from '../../util/seedTestAppointments';
import { practitionerId, seedTestPractitioners } from '../../util/seedTestPractitioners';
import { chairId, seedTestChairs } from '../../util/seedTestChairs';

import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/api/requests';

const requestId = '272d86fc-f743-4cd6-b0c8-7906959bcc9f';
const requestSeed = {
  id: requestId,
  startDate: '2017-07-19T00:16:30.932Z',
  endDate: '2017-07-19T00:17:30.932Z',
  chairId,
  patientUserId,
  practitionerId,
  note: 'a standard note',
  requestingPatientUserId: patientUserId,
  suggestedChairId: chairId,
  suggestedPractitionerId: practitionerId,
  insuranceCarrier: 'test',
  insuranceMemberId: '53245',
  insuranceGroupId: null,
  accountId,
  serviceId,
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestRequest() {
  await seedTestChairs();
  await seedTestAppointments();
  await seedTestService();
  await Request.create(requestSeed);
}

describe('/api/requests', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(Request);
    await wipeModel(Chair);
    await seedTestUsers();
    await seedTestRequest();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('GET /', () => {
    test('get all requests', () => {
      return request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body)
            .toMatchSnapshot();
        });
    });

    test('get all requests with patientUsers and services', () => {
      return request(app)
        .get(`${rootUrl}?join=patientUser,service`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['password', 'avatarUrl', 'patientUserId']);
          expect(body)
            .toMatchSnapshot();
        });
    });

    test('get all unSynced requests with patientUsers', () => {
      return request(app)
        .get(`${rootUrl}/notSynced`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['patientUser'], true);
          expect(body)
            .toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeModel(Request);
    });

    test('create request', () => {
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(requestSeed)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body)
            .toMatchSnapshot();
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
          expect(body)
            .toMatchSnapshot();
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
          expect(body)
            .toMatchSnapshot();
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
          expect(body)
            .toMatchSnapshot();
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
          expect(body)
            .toMatchSnapshot();
        });
    });
  });
});


import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { PatientRecall } from '../../../server/_models';
import wipeModel from '../../util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { patientId, seedTestPatients, wipeTestPatients } from '../../util/seedTestPatients';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/api/patientRecalls';
const patientRecallId = '28336eb6-2083-490a-9164-728282758069';

const makePatientRecall = (config = {}) => Object.assign({}, {
  accountId,
  patientId,
  dueDate: '2018-04-25T00:14:30.932Z',
  type: 'HYGIENE',
}, config);

describe('/api/patientRecalls', () => {
  let token = null;
  beforeEach(async () => {
    await wipeModel(PatientRecall);
    await seedTestUsers();
    await seedTestPatients();

    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(PatientRecall);
    await wipeTestPatients();
    await wipeTestUsers();
  });

  describe('POST', () => {
    test('/connector/batch - 4 patientRecalls created successfully', () => {
      return request(app)
        .post(`${rootUrl}/connector/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send([
          makePatientRecall(),
          makePatientRecall(),
          makePatientRecall(),
          makePatientRecall(),
        ])
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.patientRecalls).length).toBe(4);
        });
    });

    test('/connector/batch - 2 invalid patientRecalls, 2 valid patientRecalls', () => {
      return request(app)
        .post(`${rootUrl}/connector/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send([
          makePatientRecall(),
          makePatientRecall({ type: [] }),
          makePatientRecall({ type: [] }),
          makePatientRecall(),
        ])
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.patientRecalls).length).toBe(2);
        });
    });
  });

  describe('PUT', () => {
    test('/connector/batch - batch update 4', () => {
      return request(app)
        .post(`${rootUrl}/connector/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send([
          makePatientRecall(),
          makePatientRecall(),
          makePatientRecall(),
          makePatientRecall(),
        ])
        .expect(201)
        .then(({ body }) => {
          const ids = Object.keys(body.entities.patientRecalls);
          const prs = body.entities.patientRecalls;

          prs[ids[0]].type = 'fish';
          prs[ids[1]].type = 'fish';

          return request(app)
            .put(`${rootUrl}/connector/batch`)
            .set('Authorization', `Bearer ${token}`)
            .send([
              prs[ids[0]],
              prs[ids[1]],
              prs[ids[2]],
              prs[ids[3]],
            ])
            .expect(200)
            .then(({ body }) => {
              body = omitPropertiesFromBody(body);
              expect(Object.keys(body.entities.patientRecalls).length).toBe(4);
            });
        });
    });

    test('/connector/batch - batch update 4 but fail for 2', () => {
      return request(app)
        .post(`${rootUrl}/connector/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send([
          makePatientRecall(),
          makePatientRecall(),
          makePatientRecall(),
          makePatientRecall(),
        ])
        .expect(201)
        .then(({ body }) => {
          const ids = Object.keys(body.entities.patientRecalls);
          const prs = body.entities.patientRecalls;

          prs[ids[0]].type = [];
          prs[ids[1]].type = [];

          return request(app)
            .put(`${rootUrl}/connector/batch`)
            .set('Authorization', `Bearer ${token}`)
            .send([
              prs[ids[0]],
              prs[ids[1]],
              prs[ids[2]],
              prs[ids[3]],
            ])
            .expect(200)
            .then(({ body }) => {
              body = omitPropertiesFromBody(body);
              expect(Object.keys(body.entities.patientRecalls).length).toBe(2);
            });
        });
    });
  });

  describe('DELETE /', () => {
    let patientRecalls;
    beforeEach(async () => {
      patientRecalls = await PatientRecall.bulkCreate([
        makePatientRecall({ id: patientRecallId, pmsId: '3' }),
        makePatientRecall(),
      ]);
    });

    test('/:patientRecallId - delete a patientRecall', () => {
      return request(app)
        .delete(`${rootUrl}/${patientRecalls[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test.only('/:patientRecallId - delete a patientRecall and then undelete it with batch', () => {
      return request(app)
        .delete(`${rootUrl}/${patientRecalls[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(() => {
          return request(app)
            .post(`${rootUrl}/connector/batch`)
            .set('Authorization', `Bearer ${token}`)
            // Important that it has a pmsId
            .send([patientRecalls[0].get({ plain: true })])
            .expect(201)
            .then(({ body }) => {
              body = omitPropertiesFromBody(body);
              expect(body).toMatchSnapshot();
            });
        });
    });
  });
});

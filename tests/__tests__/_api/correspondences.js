
import request from 'supertest';
import app from '../../../server/bin/app';
import { Correspondence } from '../../../server/_models';
import { wipeTestUsers, seedTestUsers, accountId } from '../../_util/seedTestUsers';
import { patientId, seedTestPatients, wipeTestPatients, wipeAllModels } from '../../_util/seedTestPatients';
import generateToken from '../../_util/generateToken';
import wipeModel from '../../_util/wipeModel';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/correspondences';

const correspondenceId1 = '170c742b-232e-4000-a14d-7ef96c6f19c4';
const correspondenceId2 = '60b59ea4-ab3b-4862-9c69-6488e40b0562';
const newCorrespondenceId = 'e9c58071-039c-4b46-b225-899a8b70a0b9';
const newCorrespondenceId2 = 'ef80dda5-5e23-44ff-842a-888720dbb1b9';

async function seedTestCorrespondences() {
  await Correspondence.bulkCreate([
    {
      id: correspondenceId1,
      accountId,
      pmsId: '1',
      patientId,
      type: 'recall:sent',
      pmsType: 'MARKETING',
      note: 'CareCru: Recall sent via email',
      isSyncedWithPms: true,
      contactedAt: '2017-11-02T00:14:30.932Z',
    },
    {
      id: correspondenceId2,
      accountId,
      pmsId: '2',
      patientId,
      type: 'recall:sent',
      pmsType: 'MARKETING',
      note: 'CareCru: Recall sent via email',
      isSyncedWithPms: false,
      contactedAt: '2017-11-04T01:16:30.932Z',
    },
  ]);
}

describe('/api/correspondences', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeAllModels();
    await wipeModel(Correspondence);
    await wipeTestPatients();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestCorrespondences();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(Correspondence);
    await wipeTestPatients();
    await wipeTestUsers();
  });

  describe('GET /api/correspondences', () => {
    test('should fetch 2 correspondences with isSyncedWithPms false', async () =>
      request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, [], true);
          const correspondences = body.data;
          expect(correspondences.length).toBe(2);
          expect(body).toMatchSnapshot();
        }));

    test('should fetch 1 correspondences', async () =>
      request(app)
        .get(`${rootUrl}/connector/notSynced`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, [], true);
          const correspondences = body.data;
          expect(correspondences.length).toBe(1);
          expect(body).toMatchSnapshot();
        }));
  });

  describe('POST /api/correspondences', () => {
    afterAll(async () => {
      await seedTestCorrespondences();
    });

    test('/connector/batch - 2 correspondences created successfully', async () =>
      request(app)
        .post(`${rootUrl}/connector/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send([
          {
            id: newCorrespondenceId,
            pmsId: '3',
            patientId,
            type: 'recall:sent',
            pmsType: 'MARKETING',
            note: 'CareCru: Recall sent!',
            contactedAt: '2017-11-05T01:16:30.932Z',
          },
          {
            id: newCorrespondenceId2,
            pmsId: '4',
            patientId,
            type: 'reminder:sent',
            pmsType: 'MARKETING',
            note: 'CareCru: Recall sent!',
            contactedAt: '2017-11-03T01:16:30.932Z',
          },
        ])
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, [], true);
          expect(body.data.length).toBe(2);
          expect(body).toMatchSnapshot();
        }));

    test('/connector/batch - 1 invalid correspondence, 1 valid correspondence', async () =>
      request(app)
        .post(`${rootUrl}/connector/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send([
          {
            id: newCorrespondenceId,
            pmsId: '3',
            patientId,
            type: 'recall:sent',
            pmsType: 'MARKETING',
            note: 'CareCru: Recall sent!',
            contactedAt: '2017-11-05T01:16:30.932Z',
          },
          {
            id: correspondenceId1,
            pmsId: '4',
            type: 'reminder:sent',
            pmsType: 'MARKETING',
            note: 'CareCru: Recall sent!',
            contactedAt: '2017-11-03T01:16:30.932Z',
          },
        ])
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, [], true);
          expect(body.data.length).toBe(1);
          expect(body).toMatchSnapshot();
        }));
  });

  describe('PUT /api/correspondences/', () => {
    afterAll(async () => {
      await seedTestCorrespondences();
    });

    test('/connector/batch - 1 correspondence updated', async () =>
    request(app)
      .put(`${rootUrl}/connector/batch`)
      .set('Authorization', `Bearer ${token}`)
      .send([
        {
          id: correspondenceId1,
          pmsId: '1',
          patientId,
          type: 'reminder:sent',
          pmsType: 'Other',
          note: 'CareCru: Recall sent!',
          contactedAt: '2017-11-03T01:16:30.932Z',
        },
      ])
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body, [], true);
        expect(body.data.length).toBe(1);
        expect(body).toMatchSnapshot();
      }));
  });

  describe('DELETE /:correspondenceId', () => {
    test('should delete a correspondence', () => {
      return request(app)
        .delete(`${rootUrl}/${correspondenceId1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    test('should delete a correspondence then undelete it', () => {
      return request(app)
        .delete(`${rootUrl}/${correspondenceId2}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(() => {
          return request(app)
            .post(`${rootUrl}/connector/batch`)
            .set('Authorization', `Bearer ${token}`)
            .send([{
              id: correspondenceId2,
              pmsId: '2',
              patientId,
              type: 'reminder:sent',
              pmsType: 'MARKETING',
              note: 'CareCru: Recall sent!',
              contactedAt: '2017-11-03T01:16:30.932Z',
            }])
            .expect(201)
            .then(({ body }) => {
              body = omitPropertiesFromBody(body, [], true);
              expect(body.data[0].attributes.pmsId).toBe('2');
              expect(body).toMatchSnapshot();
            });
        });
    });
  });

  describe('DELETE /connector/batch', () => {
    test('should batch delete 2 correspondences', () => {
      return request(app)
        .delete(`${rootUrl}/connector/batch?ids=${correspondenceId1}&ids=${correspondenceId2}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(async () => {
          const correspondences = await Correspondence.findAll({});
          expect(correspondences.length).toBe(0);
        });
    });

    test('should fail batch delete 2 correspondences - an invalid id was sent', () => {
      return request(app)
        .delete(`${rootUrl}/connector/batch?ids=${correspondenceId1}&ids=${correspondenceId2}&ids=${newCorrespondenceId2}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(500)
        .then(async () => {
          const correspondences = await Correspondence.findAll({});
          expect(correspondences.length).toBe(2);
        });
    });

    test('should try to batch delete 2 correspondences with one already deleted', () => {
      return request(app)
        .delete(`${rootUrl}/${correspondenceId2}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(() => {
          return request(app)
            .delete(`${rootUrl}/connector/batch?ids=${correspondenceId1}&ids=${correspondenceId2}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
            .then(async () => {
              const correspondences = await Correspondence.findAll({});
              expect(correspondences.length).toBe(0);
            });
        });
    });
  });
});

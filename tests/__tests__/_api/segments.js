
import request from 'supertest';
import app from '../../../server/bin/app';
import { Segment } from '../../../server/_models';
import { generateTokenSequelize } from '../../util/generateToken';
import { getModelsArray, omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/segments';
const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';


/**
 * Validate single segment item
 * @param segment
 */
function validateSegment(segment) {
  expect(segment).toHaveProperty('id');
  expect(segment).toHaveProperty('name');
  expect(segment).toHaveProperty('referenceId');
  expect(segment).toHaveProperty('reference');
  expect(segment).toHaveProperty('where');
  expect(segment.reference).toBe(Segment.REFERENCE.ENTERPRISE);
  expect(segment.referenceId).toBe(enterpriseId);
}

describe('/api/segments', () => {
  // Seed with some standard user data
  let token = null;
  let token2 = null;
  beforeAll(async () => {
    token = await generateTokenSequelize({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  const segmentItems = [];
  describe('POST /api/segments', () => {
    test('Create one segment', async () => request(app)
      .post(rootUrl)
      .send({
        name: 'Test segment module',
        description: 'This is just a dummy data',
        where: {
          age: {
            $gt: [10, 15],
          },
        },
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        const segments = getModelsArray('segments', body)[0];
        validateSegment(segments);
        segmentItems.push(segments);
      }));

    test('Create additional segment', async () => request(app)
      .post(rootUrl)
      .send({
        name: 'Test segment module 2',
        where: {
          age: {
            $gt: [1, 2],
          },
        },
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        const segments = getModelsArray('segments', body)[0];
        validateSegment(segments);
        segmentItems.push(segments);
      }));
  });

  describe('GET /api/segments', () => {
    test('Get list of all segments', async () => request(app)
      .get(rootUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        const segments = getModelsArray('segments', body);
        expect(segments.length).toBe(segmentItems.length);
      }));
  });

  describe('GET /api/segments/:segmentId', () => {
    test('Get single item', async () => request(app)
      .get(`${rootUrl}/${segmentItems[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        const segments = getModelsArray('segments', body)[0];
        expect(segments.id).toBe(segmentItems[0].id);
      }));

    test('Get second item', async () => request(app)
      .get(`${rootUrl}/${segmentItems[1].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        const segments = getModelsArray('segments', body)[0];
        expect(segments.id).toBe(segmentItems[1].id);
      }));
  });

  describe('PUT /api/segments/:segmentId', () => {
    test('Update signle segment', async () => request(app)
      .put(`${rootUrl}/${segmentItems[0].id}`)
      .send({
        name: 'new name',
        description: 'New description',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        const segments = getModelsArray('segments', body)[0];
        expect(segments.name).toBe('new name');
        expect(segments.description).toBe('New description');
        expect(segments.id).toBe(segmentItems[0].id);
      }));
  });

  describe('DELETE /api/segments/:segmentId', () => {
    test('Delete segment', async () => request(app)
      .delete(`${rootUrl}/${segmentItems[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204));

    test('Fetch segments again and we should have 1', async () => request(app)
      .get(rootUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        const segments = getModelsArray('segments', body);
        expect(segments.length).toBe(1);
      }));
  });

  describe('POST /api/segments/preview', () => {
    test('Preview items', async () => request(app)
      .post(`${rootUrl}/preview`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        console.log(body);
      }));
  });

  // @TODO MISSING PERMISSION CHECK
});

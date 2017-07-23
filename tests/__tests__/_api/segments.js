
import request from 'supertest';
import app from '../../../server/bin/app';
import {
  Account,
  // Chair,
} from '../../../server/models';
import { Segment } from '../../../server/_models';
import { seedTestUsers } from '../../util/seedTestUsers';
import { generateTokenSequelize } from '../../util/generateToken';
import wipeModel, { wipeModelSequelize } from '../../util/wipeModel';
import { getModelsArray, omitPropertiesFromBody }  from '../../util/selectors';

const rootUrl = '/_api/segments';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const chairId1 = '23d4e661-1155-4494-8fdb-c4ec0ddf804d';
const chairId2 = '46d4e661-1155-4494-8fdb-c4ec0ddf804d';
const newChairId = '11d4e661-1155-4494-8fdb-c4ec0ddf804d';

async function seedData() {
  await wipeModelSequelize(Segment);
  await seedTestUsers();

  // Seed an extra account for fetching multiple and testing switching
  await Account.save({
    id: accountId2,
    enterpriseId,
    name: 'Test Account 2',
  });
}

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
    await seedData();
    token = await generateTokenSequelize({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });

    // token2 = await generateTokenSequelize({ username: 'manager2@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModelSequelize(Segment);
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

  // @TODO MISSING PERMISSION CHECK
});

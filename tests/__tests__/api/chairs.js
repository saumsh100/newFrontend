
import request from 'supertest';
import app from '../../../server/bin/app';
import { Chair } from '../../../server/_models';
import { wipeTestUsers, seedTestUsers, accountId } from '../../util/seedTestUsers';
import generateToken from '../../util/generateToken';
import wipeModel from '../../util/wipeModel';
import { getModelsArray, omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/api/chairs';
// const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const chairId1 = '23d4e661-1155-4494-8fdb-c4ec0ddf804d';
const chairId2 = '46d4e661-1155-4494-8fdb-c4ec0ddf804d';
const newChairId = '11d4e661-1155-4494-8fdb-c4ec0ddf804d';


  // Seed an extra account for fetching multiple and testing switching
  /* await Account.create({
    id: accountId2,
    enterpriseId,
    name: 'Test Account 2',
  }); */

async function seedChairs() {
  await Chair.bulkCreate([
    {
      id: chairId1,
      accountId,
      name: 'C1',
      pmsId: '12',
    },
    {
      id: chairId2,
      accountId,
      name: 'C2',
    },
  ]);
}

describe('/api/chairs', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(Chair);
    await wipeTestUsers();
    await seedTestUsers();
    await seedChairs();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(Chair);
    await wipeTestUsers();
  });

  describe('GET /api/chairs', () => {
    test('should fetch 2 chairs', async () => request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const chairs = getModelsArray('chairs', body);
          expect(chairs.length).toBe(2);
          expect(body).toMatchSnapshot();
        }));

    test('should fetch 2 chairs and be formatted in the jsonapi standard', async () => request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/vnd.api+json')
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, [], true);
          const chairs = body.data;
          expect(chairs.length).toBe(2);
          expect(body).toMatchSnapshot();
        }));
  });

  describe('GET /api/chairs/:chairId', () => {
    test('should fetch the correct chair1', async () => request(app)
        .get(`${rootUrl}/${chairId1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const chairs = getModelsArray('chairs', body);
          const [chair] = chairs;
          expect(chairs.length).toBe(1);
          expect(chair.name).toBe('C1');
          expect(body).toMatchSnapshot();
        }));

    test('should fetch the correct chair2', async () => request(app)
        .get(`${rootUrl}/${chairId2}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const chairs = getModelsArray('chairs', body);
          const [chair] = chairs;
          expect(chairs.length).toBe(1);
          expect(chair.name).toBe('C2');
          expect(body).toMatchSnapshot();
        }));
  });

  describe('POST /api/chairs', () => {
    test('should create an chair', async () => request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: newChairId,
          name: 'New Chair',
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const chairs = getModelsArray('chairs', body);
          const [chair] = chairs;
          expect(chairs.length).toBe(1);
          expect(chair.name).toBe('New Chair');
          expect(body).toMatchSnapshot();
        }));

    test('should create a chair and respond with json api', async () => request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/vnd.api+json')
        .send({
          id: newChairId,
          name: 'New Chair',
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, [], true);
          expect(body.data.attributes.name).toBe('New Chair');
          expect(body).toMatchSnapshot();
        }));

    test('should fail if required info is not there', async () => request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
          // Don't send name,
          // name: 'New Chair',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(500));
  });

  describe('PUT /api/chairs/:chairId', () => {
    test('should update a chair', async () => {
      const name = 'Modified Chair Name';
      return request(app)
        .put(`${rootUrl}/${chairId1}`)
        .send({ name })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const chairs = getModelsArray('chairs', body);
          const [chair] = chairs;
          expect(chairs.length).toBe(1);
          expect(chair.name).toBe(name);
          expect(body).toMatchSnapshot();
        });
    });

    test('should update a chair even with extra attrs', async () => {
      const name = 'Modified Chair Name';
      return request(app)
        .put(`${rootUrl}/${chairId1}`)
        .send({ name, foo: 'bar' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const chairs = getModelsArray('chairs', body);
          const [chair] = chairs;
          expect(chairs.length).toBe(1);
          expect(chair.name).toBe(name);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /:chairId', () => {
    test('should delete an chair', () => request(app)
        .delete(`${rootUrl}/${chairId1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204));

    test('should delete an chair then undelete it', () => request(app)
        .delete(`${rootUrl}/${chairId1}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(() => request(app)
            .post(rootUrl)
            .set('Authorization', `Bearer ${token}`)
            .send({
              id: chairId1,
              name: 'C5',
              pmsId: '12',
            })
            .expect(201)
            .then(({ body }) => {
              body = omitPropertiesFromBody(body);
              const chairs = getModelsArray('chairs', body);
              const [chair] = chairs;
              expect(chairs.length).toBe(1);
              expect(chair.name).toBe('C1');
              expect(body).toMatchSnapshot();
            })));
  });
});

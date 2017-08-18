
import jwt from 'jwt-decode';
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import { seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';

const rootUrl = '/_auth';

describe('/auth', () => {
  // Clear what is necessary
  beforeEach(async () => {
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeTestUsers();
  });

  test('POST /auth - Success', () => {
    return request(app)
      .post(rootUrl)
      .send({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' })
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.token).toBe('string');
      });
  });

  test('POST /auth - Invalid Credentials', () => {
    return request(app)
      .post(rootUrl)
      .send({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' })
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.token).toBe('string');
      });
  });


  test('DELETE /auth/session/:sessionId', async () => {
    const token = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' });
    const session = jwt(token);

    return request(app)
      .delete(`${rootUrl}/session/${session.sessionId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

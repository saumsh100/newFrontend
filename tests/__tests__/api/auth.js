
import request from 'supertest';
import app from '../../../server/bin/app';

const r = request(app);

describe('/auth', () => {
  test('POST /auth - with improper creds', () => {
    return r.post('/auth')
      .send({ username: 'justin@carecru.com', password: '_justin' })
      .expect(401);
  });
});


import request from 'supertest';
import app from '../../server/bin/app';

export default async function generateToken({ username, password }) {
  const response = await request(app)
    .post('/_auth')
    .send({ username, password });

  return response.body.token;
}


import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Call } from '../../../server/_models';
import wipeModel from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/callrail';

const call = {
  id: 'asdsads',
  datetime: new Date().toISOString(),
  answered: true,
  callsource: 'direct',
  wasApptBooked: true,
  destinationnum: '+16041234567',
  customer_phone_number: '+112121212',
};

describe('/api/calls', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(Call);
  });

  describe('POST /', () => {

    test('/ - post pre call', () => {
      return request(app)
        .post(`${rootUrl}/${accountId}/inbound/pre-call`)
        .set('Authorization', `Bearer ${token}`)
        .send(call)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['lastTextMessageId']);
          expect(body).toMatchSnapshot();
        });
    });

    test('/ - post post call', () => {
      return request(app)
        .post(`${rootUrl}/${accountId}/inbound/post-call`)
        .set('Authorization', `Bearer ${token}`)
        .send(call)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['lastTextMessageId']);
          expect(body).toMatchSnapshot();
        });
    });
  });
});


import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { SyncClientVersion } from '../../../server/_models';
import wipeModel from '../../util/wipeModel';
import { seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { omitPropertiesFromBody, omitProperties } from '../../util/selectors';

const rootUrl = '/api/updater';
const syncClientVersionId = '126d3cb0-4468-4503-9254-77fb1e8df539';
const syncClientVersion = {
  id: syncClientVersionId,
  major: 2,
  minor: 0,
  patch: 0,
  build: 0,
  url: '',
  key: '',
  secret: '',
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestSyncClientVersion() {
  await wipeModel(SyncClientVersion);
  await SyncClientVersion.create(syncClientVersion);
}

describe('/api/updater', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeTestUsers();
    await seedTestUsers();
    await wipeModel(SyncClientVersion);
    await seedTestSyncClientVersion();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeTestUsers();
    await wipeModel(SyncClientVersion);
  });

  describe('GET /', () => {
    test('/available - new version available', () => {
      return request(app)
        .get(`${rootUrl}/available?version=1.0.0.0`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/available - new version not available', () => {
      return request(app)
        .get(`${rootUrl}/available?version=2.0.0.0`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/available - invalid version number', () => {
      return request(app)
        .get(`${rootUrl}/available?version=xx`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/release - retrieve latest release info', () => {
      return request(app)
        .get(`${rootUrl}/release`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitProperties(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestSyncClientVersion();
    });

    test('/bump - bump up the version number', () => {
      return request(app)
        .put(`${rootUrl}/bump`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          body = omitProperties(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/unbump - bump down the version number', () => {
      return request(app)
        .put(`${rootUrl}/unbump`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          body = omitProperties(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

});

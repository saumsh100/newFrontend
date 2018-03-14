
import request from 'supertest';
import app from '../../../server/bin/app';
import { accountId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { patientUserId, seedTestPatients, wipeTestPatients } from '../../util/seedTestPatients';
import { omitPropertiesFromBody, omitProperties } from '../../util/selectors';

const host = 'my2.test.com';

describe('/widgets', () => {
  beforeEach(async() => {
    await wipeTestPatients();
    await wipeTestUsers();
    await seedTestUsers();
  });

  afterAll(async() => {
    await wipeTestPatients();
    await wipeTestUsers();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestPatients();
    });

    // TODO: Just returns an empty entities object...
    test('/:accountId/embed - [no description]', () => {
      return request(app)
        .get(`/widgets/${accountId}/embed`)
        .set('Host', host)
        .expect(200)
        .then(({body}) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

describe('/patientUsers', () => {
  beforeEach(async() => {
    await wipeTestPatients();
    await wipeTestUsers();
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeTestPatients();
    await wipeTestUsers();
  });


  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestPatients();
    });

    test('/patientUsers/:patientUserId - retrieve patientUser', () => {
      return request(app)
        .get(`/patientUsers/${patientUserId}`)
        .set('Host', host)
        .expect(200)
        .then(({ body }) => {
          body = omitProperties(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeTestPatients();
    });

    test('/patientUsers/email - check if patientuser with given email exists - exists', async () => {
      await seedTestPatients();
      return request(app)
        .post('/patientUsers/email')
        .set('Host', host)
        .send({
          email: 'testpatientuser@test.com',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/patientUsers/email - check if patientuser with given email exists - does not exist', async () => {
      await seedTestPatients();
      return request(app)
        .post('/patientUsers/email')
        .set('Host', host)
        .send({
          email: 'ronaldmcdonald@test.com',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/patientUsers/phoneNumber - check if patientuser with given phoneNumber exists - exists', async () => {
      await seedTestPatients();
      return request(app)
        .post('/patientUsers/phoneNumber')
        .set('Host', host)
        .send({
          phoneNumber: '+16049999999',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/patientUsers/phoneNumber - check if patientuser with given phoneNumber exists - does not exist', async () => {
      await seedTestPatients();
      return request(app)
        .post('/patientUsers/phoneNumber')
        .set('Host', host)
        .send({
          phoneNumber: '+16049919999',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

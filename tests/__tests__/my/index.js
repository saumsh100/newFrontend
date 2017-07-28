
import request from 'supertest';
import app from '../../../server/bin/app';
import { PatientUser, Patient } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { patientUserId, seedTestPatients } from '../../util/seedTestPatients';
import { omitPropertiesFromBody } from '../../util/selectors';

describe('/widgets', () => {
  beforeAll(async() => {
    await seedTestUsers();
  });

  afterAll(async() => {
    await wipeAllModels();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestPatients();
    });

    // TODO: Just returns an empty entities object...
    test('/:accountId/embed - [no description]', () => {
      return request(app)
        .get(`/widgets/${accountId}/embed`)
        .set('Host', 'my.test.com')
        .expect(200)
        .then(({body}) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

describe('/patientUsers', () => {
  beforeAll(async() => {
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeAllModels();
  });


  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestPatients();
    });

    test('/patientUsers/:patientUserId - retrieve patientUser', () => {
      return request(app)
        .get(`/patientUsers/${patientUserId}`)
        .set('Host', 'my.test.com')
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeModel(PatientUser);
      await wipeModel(Patient);
    });

    test('/patientUsers/email - check if patientuser with given email exists - exists', async () => {
      await seedTestPatients();
      return request(app)
        .post('/patientUsers/email')
        .set('Host', 'my.test.com')
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
        .set('Host', 'my.test.com')
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
        .set('Host', 'my.test.com')
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
        .set('Host', 'my.test.com')
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

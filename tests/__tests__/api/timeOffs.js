
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { PractitionerRecurringTimeOff, Practitioner } from '../../../server/_models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, seedTestUsers } from '../../util/seedTestUsers';
import { practitionerId, seedTestPractitioners } from '../../util/seedTestPractitioners';
import { omitPropertiesFromBody } from '../../util/selectors';

const practitionerTimeOffId = '46344262-9039-47fa-a4e6-d762dcc57308';
const practitionerTimeOff = {
  id: practitionerTimeOffId,
  practitionerId,
  pmsId: '12',
  startDate: '2017-07-19T00:16:30.932Z',
  endDate: '2017-07-19T00:17:30.932Z',
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestPractitionerTimeOffs() {
  await wipeModel(Practitioner);
  await seedTestPractitioners();
  await wipeModel(PractitionerRecurringTimeOff);
  await PractitionerRecurringTimeOff.create(practitionerTimeOff);
}

describe('/api/recurringTimeOffs', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('POST /', () => {
    beforeEach(async () => {
      await seedTestPractitioners();
      await wipeModel(PractitionerRecurringTimeOff);
    });

    test('create time off', () => {
      return request(app)
        .post('/api/recurringTimeOffs')
        .set('Authorization', `Bearer ${token}`)
        .send(practitionerTimeOff)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestPractitionerTimeOffs();
    });

    test('/:timeOffId - delete a time off', () => {
      return request(app)
        .delete(`/api/recurringTimeOffs/${practitionerTimeOffId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:timeOffId - delete a time off then undelete it', () => {
      return request(app)
        .delete(`/api/recurringTimeOffs/${practitionerTimeOffId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(() => {
          return request(app)
            .post('/api/recurringTimeOffs')
            .set('Authorization', `Bearer ${token}`)
            .send(practitionerTimeOff)
            .expect(201)
            .then(({ body }) => {
              body = omitPropertiesFromBody(body);
              expect(body).toMatchSnapshot();
            });
        });
    });
  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestPractitionerTimeOffs();
    });

    test('/:timeOffId - update a time off', () => {
      return request(app)
        .put(`/api/recurringTimeOffs/${practitionerTimeOffId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          endDate: '2017-07-19T00:18:30.932Z',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});


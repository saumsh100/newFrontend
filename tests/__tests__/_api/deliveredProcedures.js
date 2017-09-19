
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import { DeliveredProcedure } from '../../../server/_models';
import wipeModel from '../../_util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import { patientId, seedTestPatients, wipeTestPatients } from '../../_util/seedTestPatients';
import { code, seedTestProcedures, wipeTestProcedures } from '../../_util/seedTestProcedures';
import { omitPropertiesFromBody, getModelsArray, omitProperties } from '../../util/selectors';

const rootUrl = '/_api/deliveredProcedures';

const makeDeliveredProcedure = (config = {}) => Object.assign({}, {
  accountId,
  patientId,
  procedureCode: code,
  entryDate: '2017-07-19T00:14:30.932Z',
}, config);

describe('/api/deliveredProcedures', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(DeliveredProcedure);
    await seedTestUsers();
    await seedTestPatients();
    await seedTestProcedures();

    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(DeliveredProcedure);
    await wipeTestProcedures();
    await wipeTestPatients();
    await wipeTestUsers();
  });

  describe('POST /', () => {
    test('/ - create a deliverProcedure', () => {
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(makeDeliveredProcedure())
        .expect(201)
        .then(({ body }) => {
          const dps = getModelsArray('deliveredProcedures', body);
          expect(omitProperties(dps[0], ['id'])).toMatchSnapshot();
        });
    });

    test('/batch - 4 deliverProcedures created successfully', () => {
      console.log(makeDeliveredProcedure());
      return request(app)
        .post(`${rootUrl}/connector/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send([
          makeDeliveredProcedure(),
          makeDeliveredProcedure(),
          makeDeliveredProcedure(),
          makeDeliveredProcedure(),
        ])
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.deliveredProcedures).length).toBe(4);
        });
    });

    test('/batch - 1 invalid deliverProcedure, 3 valid deliverProcedure', () => {

      return request(app)
        .post(`${rootUrl}/connector/batch`)
        .set('Authorization', `Bearer ${token}`)
        .send([
          makeDeliveredProcedure({ procedureCode: '123112' }),
          makeDeliveredProcedure(),
          makeDeliveredProcedure(),
          makeDeliveredProcedure(),
        ])
        .expect(500)
        .then(({ body }) => {
        });
    });

  });
});

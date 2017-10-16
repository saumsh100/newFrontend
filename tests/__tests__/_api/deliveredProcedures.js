
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../_util/generateToken';
import { DeliveredProcedure } from '../../../server/_models';
import wipeModel from '../../_util/wipeModel';
import { accountId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import { patientId, seedTestPatients, wipeTestPatients } from '../../_util/seedTestPatients';
import { code, seedTestProcedures, wipeTestProcedures } from '../../_util/seedTestProcedures';
import { seedTestDeliveredProcedures, wipeTestDeliveredProcedures } from '../../_util/seedTestDeliveredProcedures';
import { omitPropertiesFromBody, getModelsArray, omitProperties } from '../../util/selectors';

import {
  mostBusinessProcedure,
  mostBusinessPatient,
} from '../../../server/lib/intelligence/revenue';

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

describe('Revenue Functions', () => {
  beforeAll(async () => {
    await seedTestUsers();
    await seedTestPatients();
    await seedTestProcedures();
    await seedTestDeliveredProcedures();
  });

  afterAll(async () => {
    await wipeTestDeliveredProcedures();
    await wipeTestProcedures();
    await wipeTestPatients();
    await wipeTestUsers();
  });

  it('should respond the total amount spent on Test Procedure', (done) => {
    const startDate = (new Date(2017, 1, 1)).toISOString();
    const endDate = (new Date(2018, 1, 1)).toISOString();
    mostBusinessProcedure(startDate, endDate, accountId)
      .then((result) => {
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].procedureCode).toBe(code);
        expect(result[0].totalAmount).toBe(432.22);
        done();
      }).catch();
  });

  it('should respond with an array with one patient (Ronald Mcdonald) and the total spent by him', (done) => {
    const startDate = (new Date(2017, 1, 1)).toISOString();
    const endDate = (new Date(2018, 1, 1)).toISOString();
    mostBusinessPatient(startDate, endDate, accountId)
      .then((result) => {
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].totalAmount).toBe(432.22);
        expect(result[0].firstName).toBe('Ronald');
        expect(result[0].lastName).toBe('Mcdonald');
        done();
      }).catch();
  });
});

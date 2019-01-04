
import request from 'supertest';
import omit from 'lodash/omit';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { seedTestPatientsList, patientId2, patientId3 } from '../../util/seedTestPatientsList';
import { seedTestUsers } from '../../util/seedTestUsers';
import { wipeAllModels } from '../../util/wipeModel';

const rootUrl = '/_api/table/search';

describe('/_api/table/search', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    await seedTestPatientsList();
    token = await generateToken({
      username: 'manager@test.com',
      password: '!@CityOfBudaTest#$',
    });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('age query builder', () => {
    test('array', async () => request(app)
      .get(`${rootUrl}?age[]=5&age[]=20`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId2, patientId3]);
      }));

    test('greaterThen', async () => request(app)
      .get(`${rootUrl}?age={"greaterThan":12}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId3]);
      }));

    test('multiple comparators', async () => request(app)
      .get(`${rootUrl}?age={"greaterThan":20, "lessThan": 12}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId2]);
      }));

    test('raw comparator', async () => request(app)
      .get(`${rootUrl}?age={"$gt":12}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId3]);
      }));

    test('raw operator stacks with comparator', async () => request(app)
      .get(`${rootUrl}?age={"greaterThan":30,"$gt":12}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId3]);
      }));

    test('raw operator stacks with comparator doesnt matter the order', async () => request(app)
      .get(`${rootUrl}?age={"$gt":12,"greaterThan":30}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId3]);
      }));
  });
});

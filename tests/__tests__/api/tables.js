
import request from 'supertest';
import omit from 'lodash/omit';
import { Patient } from 'CareCruModels';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { seedTestPatientsList, patientId1, patientId2, patientId3 } from '../../util/seedTestPatientsList';
import { seedTestUsers } from '../../util/seedTestUsers';
import { seedTestAppointments, appointment } from '../../util/seedTestAppointments';
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

  describe('dateTime query builder', () => {
    beforeAll(async () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date(2018, 5, 3).toISOString());
      await seedTestAppointments();
      await Patient.update({
        firstApptId: appointment.id,
        firstApptDate: new Date(2018, 5, 5),
      }, { where: { id: patientId1 } });
    });

    test('between', async () => request(app)
      .get(`${rootUrl}?firstApptDate[]='2015-01-01T00:00:00.000Z'&firstApptDate[]='2019-01-01T01:00:00.000Z'`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId1]);
      }));

    test('no results', async () => request(app)
      .get(`${rootUrl}?firstApptDate[]='2019-01-01T00:00:00.000Z'&firstApptDate[]='2020-01-01T01:00:00.000Z'`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([]);
      }));


    test('after', async () => request(app)
      .get(`${rootUrl}?firstApptDate={"after":"2018-01-01T00:00:00.000Z" }`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId1]);
      }));

    test('before', async () => request(app)
      .get(`${rootUrl}?firstApptDate={"before":"2018-12-31T01:00:00.000Z" }`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId1]);
      }));

    test('afterRelative', async () => request(app)
      .get(`${rootUrl}?firstApptDate={ "afterRelative": "10 days" }`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId1]);
      }));

    test('betweenRelative', async () => request(app)
      .get(`${rootUrl}?firstApptDate={"betweenRelative":["20 days","20 days"] }`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
        expect(patients).toEqual([patientId1]);
      }));

    test('beforeRelative', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date(2018, 5, 10).toISOString());
      return request(app)
        .get(`${rootUrl}?firstApptDate={"beforeRelative":"10 days" }`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          const patients = Object.keys(omit(body.entities.patients, ['totalPatients']));
          expect(patients).toEqual([patientId1]);
        });
    });
  });
});

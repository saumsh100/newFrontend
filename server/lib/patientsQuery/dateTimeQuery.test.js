
import { Patient } from 'CareCruModels';
import patientQueryBuilder from './index';
import { seedTestPatientsList, patientId1, patientId2 } from '../../../tests/util/seedTestPatientsList';
import { accountId, seedTestUsers } from '../../../tests/util/seedTestUsers';
import { wipeAllModels } from '../../../tests/util/wipeModel';

describe('#patientQueryBuilder dateTime query', () => {
  beforeAll(async () => {
    await seedTestUsers();
    await seedTestPatientsList();
    await Patient.update({
      firstApptDate: new Date(2018, 5, 5),
      lastApptDate: new Date(2018, 3, 4),
      nextApptDate: new Date(2018, 3, 4),
      pmsCreatedAt: new Date(2018, 3, 4),
    }, { where: { id: patientId1 } });

    await Patient.update({
      lastApptDate: new Date(2018, 3, 10),
      nextApptDate: new Date(2018, 3, 10),
      pmsCreatedAt: new Date(2018, 3, 10),
    }, { where: { id: patientId2 } });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('firstApptDate', () => {
    beforeAll(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 5, 3));
    });

    it('between', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: [
          new Date(2015, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ],
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('$lt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: { $lt: new Date(2018, 11, 20).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('$gt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: { $gt: new Date(2016, 11, 20).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('after', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: { after: new Date(2018, 4, 20).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('before', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: { before: new Date(2018, 11, 20).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('after relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: {
          afterRelative: {
            interval: '10 day',
            date: new Date(2018, 5, 5).toISOString(),
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('after relative string', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: { afterRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('before relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: {
          beforeRelative: {
            interval: '5 days',
            date: new Date(2018, 5, 6).toISOString(),
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('between relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: { betweenRelative: ['10 day', '5 day'] },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('together', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: {
          after: new Date(2018, 5, 1).toISOString(),
          before: new Date(2018, 11, 21).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('raw stacks with the comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: {
          $gt: new Date(2018, 1, 11).toISOString(),
          before: new Date(2018, 11, 21).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('stacking don\'t care about order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: {
          after: new Date(2018, 1, 11).toISOString(),
          $lt: new Date(2018, 11, 21).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('before relative string', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date(2018, 5, 10).toISOString());
      const result = await patientQueryBuilder({
        accountId,
        firstApptDate: { beforeRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });

  describe('lastApptDate', () => {
    beforeAll(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 5, 3));
    });

    it('between', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: [
          new Date(2015, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ],
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId1]);
    });

    test('$lt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: { $lt: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('$gt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: { $gt: new Date(2018, 3, 8).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('after', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: { after: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('before', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: { before: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('after relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: {
          afterRelative: {
            interval: '10 days',
            date: new Date(2018, 3, 6).toISOString(),
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('after relative string', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: { afterRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([]);
    });

    test('before relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: {
          beforeRelative: {
            interval: '5 days',
            date: new Date(2018, 3, 6).toISOString(),
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('between relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: { betweenRelative: ['10 day', '5 day'] },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([]);
    });

    test('together', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: {
          after: new Date(2018, 3, 8).toISOString(),
          before: new Date(2018, 3, 12).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('raw stacks with the comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: {
          $gt: new Date(2018, 3, 7).toISOString(),
          before: new Date(2018, 3, 12).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('stacking don\'t care about order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: {
          after: new Date(2018, 3, 7).toISOString(),
          $lt: new Date(2018, 3, 11).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('before relative string', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date(2018, 3, 6).toISOString());
      const result = await patientQueryBuilder({
        accountId,
        lastApptDate: { beforeRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });

  describe('nextApptDate', () => {
    beforeAll(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 5, 3));
    });

    it('between', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: [
          new Date(2015, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ],
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId1]);
    });

    test('$lt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: { $lt: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('$gt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: { $gt: new Date(2018, 3, 8).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('after', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: { after: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('before', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: { before: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('after relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: {
          afterRelative: {
            interval: '10 days',
            date: new Date(2018, 3, 6).toISOString(),
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('after relative string', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: { afterRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([]);
    });

    test('before relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: {
          beforeRelative: {
            interval: '5 days',
            date: new Date(2018, 3, 6).toISOString(),
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('between relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: { betweenRelative: ['10 day', '5 day'] },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([]);
    });

    test('together', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: {
          after: new Date(2018, 3, 8).toISOString(),
          before: new Date(2018, 3, 12).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('raw stacks with the comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: {
          $gt: new Date(2018, 3, 7).toISOString(),
          before: new Date(2018, 3, 12).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('stacking don\'t care about order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: {
          after: new Date(2018, 3, 7).toISOString(),
          $lt: new Date(2018, 3, 11).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('before relative string', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date(2018, 3, 6).toISOString());
      const result = await patientQueryBuilder({
        accountId,
        nextApptDate: { beforeRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });

  describe('pmsCreatedAt', () => {
    beforeAll(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 5, 3));
    });

    it('between', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: [
          new Date(2015, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ],
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId1]);
    });

    test('$lt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: { $lt: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('$gt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: { $gt: new Date(2018, 3, 8).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('after', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: { after: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('before', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: { before: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('after relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: {
          afterRelative: {
            interval: '10 days',
            date: new Date(2018, 3, 6).toISOString(),
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('after relative string', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: { afterRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([]);
    });

    test('before relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: {
          beforeRelative: {
            interval: '5 days',
            date: new Date(2018, 3, 6).toISOString(),
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('between relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: { betweenRelative: ['10 day', '5 day'] },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([]);
    });

    test('together', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: {
          after: new Date(2018, 3, 8).toISOString(),
          before: new Date(2018, 3, 12).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('raw stacks with the comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: {
          $gt: new Date(2018, 3, 7).toISOString(),
          before: new Date(2018, 3, 12).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('stacking don\'t care about order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: {
          after: new Date(2018, 3, 7).toISOString(),
          $lt: new Date(2018, 3, 11).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('before relative string', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date(2018, 3, 6).toISOString());
      const result = await patientQueryBuilder({
        accountId,
        pmsCreatedAt: { beforeRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });
});

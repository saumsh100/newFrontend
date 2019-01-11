
import { Patient } from 'CareCruModels';
import patientQueryBuilder from './index';
import { seedTestPatientsList, patientId1, patientId2, patientId3 } from '../../../tests/util/seedTestPatientsList';
import { accountId, seedTestUsers } from '../../../tests/util/seedTestUsers';
import { wipeAllModels } from '../../../tests/util/wipeModel';

describe('#patientQueryBuilder dateTime query', () => {
  beforeAll(async () => {
    await seedTestUsers();
    await seedTestPatientsList();
    await Patient.update({
      dueForHygieneDate: new Date(2018, 3, 4),
      dueForRecallExamDate: new Date(2018, 3, 4),
    }, { where: { id: patientId1 } });

    await Patient.update({
      dueForHygieneDate: new Date(2018, 3, 10),
      dueForRecallExamDate: new Date(2018, 3, 10),
    }, { where: { id: patientId2 } });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('birthDate', () => {
    beforeAll(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => new Date(2004, 11, 29));
    });

    it('between', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: '1990-01-01',
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('$lt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: { $lt: new Date(2007, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId1]);
    });

    test('$gt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: { $gt: new Date(2007, 3, 8).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('after', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: { after: '2003-04-06' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3]);
    });

    test('before', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: { before: '2006-04-06' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId1]);
    });

    test('after relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: {
          afterRelative: {
            interval: '10 days',
            date: '2009-12-26',
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('after relative string', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: { afterRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('before relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: {
          beforeRelative: {
            interval: '5 days',
            date: '2010-01-03',
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('between relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: { betweenRelative: ['10 day', '5 day'] },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('together', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: {
          after: '2009-11-10',
          before: '2010-04-12',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('raw stacks with the comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: {
          $gt: new Date(2009, 3, 7).toISOString(),
          before: '2010-04-12',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('stacking don\'t care about order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        birthDate: {
          after: '2009-04-07',
          $lt: new Date(2010, 3, 11).toISOString(),
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('before relative string', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date(1990, 0, 3).toISOString());
      const result = await patientQueryBuilder({
        accountId,
        birthDate: { beforeRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });

  describe('dueForHygieneDate', () => {
    beforeAll(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 5, 3));
    });

    it('between', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: [
          '2015-02-01',
          '2019-02-01',
        ],
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId1]);
    });

    test('$lt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: { $lt: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('$gt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: { $gt: new Date(2018, 3, 8).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('after', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: { after: '2018-04-06' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('before', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: { before: '2018-04-06' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('after relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: {
          afterRelative: {
            interval: '10 days',
            date: '2018-04-06',
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('after relative string', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: { afterRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([]);
    });

    test('before relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: {
          beforeRelative: {
            interval: '5 days',
            date: '2018-04-06',
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('between relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: { betweenRelative: ['10 day', '5 day'] },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([]);
    });

    test('together', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: {
          after: '2018-04-08',
          before: '2018-04-12',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('raw stacks with the comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: {
          $gt: new Date(2018, 3, 7).toISOString(),
          before: '2018-04-12',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('stacking don\'t care about order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForHygieneDate: {
          after: '2018-04-07',
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
        dueForHygieneDate: { beforeRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });

  describe('dueForRecallExamDate', () => {
    beforeAll(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 5, 3));
    });

    it('between', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: [
          '2015-02-01',
          '2019-02-01',
        ],
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId1]);
    });

    test('$lt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: { $lt: new Date(2018, 3, 6).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('$gt', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: { $gt: new Date(2018, 3, 8).toISOString() },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('after', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: { after: '2018-04-06' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('before', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: { before: '2018-04-06' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('after relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: {
          afterRelative: {
            interval: '10 days',
            date: '2018-04-06',
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('after relative string', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: { afterRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([]);
    });

    test('before relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: {
          beforeRelative: {
            interval: '5 days',
            date: '2018-04-06',
          },
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('between relative', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: { betweenRelative: ['10 day', '5 day'] },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([]);
    });

    test('together', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: {
          after: '2018-04-08',
          before: '2018-04-12',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('raw stacks with the comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: {
          $gt: new Date(2018, 3, 7).toISOString(),
          before: '2018-04-12',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('stacking don\'t care about order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        dueForRecallExamDate: {
          after: '2018-04-07',
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
        dueForRecallExamDate: { beforeRelative: '10 days' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });
});

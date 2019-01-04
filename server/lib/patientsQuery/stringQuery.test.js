
import {
  patientId1,
  patientId2,
  patientId3,
  seedTestPatientsList,
} from '../../../tests/util/seedTestPatientsList';
import { accountId, seedTestUsers } from '../../../tests/util/seedTestUsers';
import { wipeAllModels } from '../../../tests/util/wipeModel';
import patientQueryBuilder from './index';

describe('#patientQueryBuilder string query', () => {
  beforeAll(async () => {
    await seedTestUsers();
    await seedTestPatientsList();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('firstName', () => {
    it('just uses starts_with', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstName: 'ro',
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('contains', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstName: { contains: 'al' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('startsWith', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstName: { startsWith: 'ja' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3]);
    });

    test('endsWith', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstName: { endsWith: 'on' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('equal', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstName: { equal: 'Ronald' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    it('uses multiple comparators', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstName: {
          startsWith: 'ro',
          endsWith: 'ld',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    it('uses raw comparators', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstName: { $iLike: '%al%' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('raw operator stacks with comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstName: {
          startsWith: 'ro',
          $iLike: '%al%',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });

    test('raw operator stacks with comparator doesnt matter the order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        firstName: {
          $iLike: '%al%',
          startsWith: 'ro',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });

  describe('mobilePhoneNumber', () => {
    it('just uses starts_with', async () => {
      const result = await patientQueryBuilder({
        accountId,
        mobilePhoneNumber: '+177',
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('contains', async () => {
      const result = await patientQueryBuilder({
        accountId,
        mobilePhoneNumber: { contains: '90' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('startsWith', async () => {
      const result = await patientQueryBuilder({
        accountId,
        mobilePhoneNumber: { startsWith: '+177' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('endsWith', async () => {
      const result = await patientQueryBuilder({
        accountId,
        mobilePhoneNumber: { endsWith: '91' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('equal', async () => {
      const result = await patientQueryBuilder({
        accountId,
        mobilePhoneNumber: { equal: '+17789999991' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    it('uses multiple comparators', async () => {
      const result = await patientQueryBuilder({
        accountId,
        mobilePhoneNumber: {
          startsWith: '+17',
          endsWith: '90',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    it('uses raw comparators', async () => {
      const result = await patientQueryBuilder({
        accountId,
        mobilePhoneNumber: { $iLike: '%999%' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('raw operator stacks with comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        mobilePhoneNumber: {
          startsWith: '+17',
          $iLike: '%99%',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('raw operator stacks with comparator doesnt matter the order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        mobilePhoneNumber: {
          $iLike: '%99%',
          endsWith: '99',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });

  describe('homePhoneNumber', () => {
    it('just uses starts_with', async () => {
      const result = await patientQueryBuilder({
        accountId,
        homePhoneNumber: '+177',
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('contains', async () => {
      const result = await patientQueryBuilder({
        accountId,
        homePhoneNumber: { contains: '90' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('startsWith', async () => {
      const result = await patientQueryBuilder({
        accountId,
        homePhoneNumber: { startsWith: '+177' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('endsWith', async () => {
      const result = await patientQueryBuilder({
        accountId,
        homePhoneNumber: { endsWith: '91' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('equal', async () => {
      const result = await patientQueryBuilder({
        accountId,
        homePhoneNumber: { equal: '+17789999991' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    it('uses multiple comparators', async () => {
      const result = await patientQueryBuilder({
        accountId,
        homePhoneNumber: {
          startsWith: '+17',
          endsWith: '90',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    it('uses raw comparators', async () => {
      const result = await patientQueryBuilder({
        accountId,
        homePhoneNumber: { $iLike: '%999%' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('raw operator stacks with comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        homePhoneNumber: {
          startsWith: '+17',
          $iLike: '%99%',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('raw operator stacks with comparator doesnt matter the order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        homePhoneNumber: {
          $iLike: '%99%',
          endsWith: '99',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });

  describe('workPhoneNumber', () => {
    it('just uses starts_with', async () => {
      const result = await patientQueryBuilder({
        accountId,
        workPhoneNumber: '+177',
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('contains', async () => {
      const result = await patientQueryBuilder({
        accountId,
        workPhoneNumber: { contains: '90' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('startsWith', async () => {
      const result = await patientQueryBuilder({
        accountId,
        workPhoneNumber: { startsWith: '+177' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('endsWith', async () => {
      const result = await patientQueryBuilder({
        accountId,
        workPhoneNumber: { endsWith: '91' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('equal', async () => {
      const result = await patientQueryBuilder({
        accountId,
        workPhoneNumber: { equal: '+17789999991' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    it('uses multiple comparators', async () => {
      const result = await patientQueryBuilder({
        accountId,
        workPhoneNumber: {
          startsWith: '+17',
          endsWith: '90',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    it('uses raw comparators', async () => {
      const result = await patientQueryBuilder({
        accountId,
        workPhoneNumber: { $iLike: '%999%' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('raw operator stacks with comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        workPhoneNumber: {
          startsWith: '+17',
          $iLike: '%99%',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('raw operator stacks with comparator doesnt matter the order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        workPhoneNumber: {
          $iLike: '%99%',
          endsWith: '99',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });

  describe('otherPhoneNumber', () => {
    it('just uses starts_with', async () => {
      const result = await patientQueryBuilder({
        accountId,
        otherPhoneNumber: '+177',
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('contains', async () => {
      const result = await patientQueryBuilder({
        accountId,
        otherPhoneNumber: { contains: '90' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    test('startsWith', async () => {
      const result = await patientQueryBuilder({
        accountId,
        otherPhoneNumber: { startsWith: '+177' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('endsWith', async () => {
      const result = await patientQueryBuilder({
        accountId,
        otherPhoneNumber: { endsWith: '91' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    test('equal', async () => {
      const result = await patientQueryBuilder({
        accountId,
        otherPhoneNumber: { equal: '+17789999991' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId3]);
    });

    it('uses multiple comparators', async () => {
      const result = await patientQueryBuilder({
        accountId,
        otherPhoneNumber: {
          startsWith: '+17',
          endsWith: '90',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2]);
    });

    it('uses raw comparators', async () => {
      const result = await patientQueryBuilder({
        accountId,
        otherPhoneNumber: { $iLike: '%999%' },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('raw operator stacks with comparator', async () => {
      const result = await patientQueryBuilder({
        accountId,
        otherPhoneNumber: {
          startsWith: '+17',
          $iLike: '%99%',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId2, patientId3, patientId1]);
    });

    test('raw operator stacks with comparator doesnt matter the order', async () => {
      const result = await patientQueryBuilder({
        accountId,
        otherPhoneNumber: {
          $iLike: '%99%',
          endsWith: '99',
        },
      });

      const patients = result.rows.map(({ id }) => id);
      expect(patients).toEqual([patientId1]);
    });
  });
});


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

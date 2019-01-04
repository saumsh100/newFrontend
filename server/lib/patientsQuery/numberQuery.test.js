
import {
  patientId1,
  patientId2,
  patientId3,
  seedTestPatientsList,
} from '../../../tests/util/seedTestPatientsList';
import { accountId, seedTestUsers } from '../../../tests/util/seedTestUsers';
import { wipeAllModels } from '../../../tests/util/wipeModel';
import patientQueryBuilder from './index';

describe('#patientQueryBuilder number query', () => {
  beforeAll(async () => {
    await seedTestUsers();
    await seedTestPatientsList();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  it('just adds between', async () => {
    const result = await patientQueryBuilder({
      accountId,
      age: [5, 20],
    });
    const patients = result.rows.map(({ id }) => id);
    expect(patients).toEqual([patientId2, patientId3]);
  });

  test('greaterThan', async () => {
    const result = await patientQueryBuilder({
      accountId,
      age: { greaterThan: 12 },
    });

    const patients = result.rows.map(({ id }) => id);
    expect(patients).toEqual([patientId3]);
  });

  test('lessThan', async () => {
    const result = await patientQueryBuilder({
      accountId,
      age: { lessThan: 12 },
    });

    const patients = result.rows.map(({ id }) => id);
    expect(patients).toEqual([patientId2, patientId1]);
  });

  test('between', async () => {
    const result = await patientQueryBuilder({
      accountId,
      age: { between: [5, 20] },
    });

    const patients = result.rows.map(({ id }) => id);
    expect(patients).toEqual([patientId2, patientId3]);
  });

  it('uses multiple comparators', async () => {
    const result = await patientQueryBuilder({
      accountId,
      age: {
        greaterThan: 20,
        lessThan: 12,
      },
    });

    const patients = result.rows.map(({ id }) => id);
    expect(patients).toEqual([patientId2]);
  });

  it('uses raw comparators', async () => {
    const result = await patientQueryBuilder({
      accountId,
      age: { $gt: 12 },
    });

    const patients = result.rows.map(({ id }) => id);
    expect(patients).toEqual([patientId3]);
  });

  test('raw operator stacks with comparator', async () => {
    const result = await patientQueryBuilder({
      accountId,
      age: {
        greaterThan: 30,
        $gt: 12,
      },
    });

    const patients = result.rows.map(({ id }) => id);
    expect(patients).toEqual([patientId3]);
  });

  test('raw operator stacks with comparator doesnt matter the order', async () => {
    const result = await patientQueryBuilder({
      accountId,
      age: {
        $gt: 12,
        greaterThan: 30,
      },
    });

    const patients = result.rows.map(({ id }) => id);
    expect(patients).toEqual([patientId3]);
  });
});

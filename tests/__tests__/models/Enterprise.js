
import { Enterprise } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';

async function wipeEnterpriseTable() {
  await Enterprise.destroy({
    where: {},
    truncate: true,
    force: true,
  });
}

const makeData = (data = {}) => (Object.assign({
  name: 'Test Enterprise',
}, data));

const fail = 'Your code should be failing but it is passing';

describe('models/Enterprise', () => {
  beforeEach(async () => {
    await wipeEnterpriseTable();
  });

  afterAll(async () => {
    await wipeEnterpriseTable();
  });

  describe('Data Validation', () => {
    test('should be able to save a Enterprise without id provided', async () => {
      const data = makeData();
      const enterprise = await Enterprise.create(data);
      expect(omitProperties(enterprise.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have default plan', async () => {
      const data = makeData();
      const enterprise = await Enterprise.create(data);
      expect(enterprise.plan).toBe('GROWTH');
    });

    test('should throw error for wrong growth plan', async () => {
      const data = makeData({ plan: 'NOT_A_PLAN' });
      try {
        await Enterprise.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeDatabaseError');
      }
    });
  });
});

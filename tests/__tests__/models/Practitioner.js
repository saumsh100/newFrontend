
import {
  Account,
  Practitioner,
  Practitioner_Service,
  Service,
} from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const makeData = (data = {}) => Object.assign({
  firstName: 'Test',
  lastName: 'Practitioner',
  accountId,
}, data);

const makeServiceData = () => Object.assign({
  name: 'Test Service',
  accountId,
  duration: 4,
});

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Practitioner', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Practitioner);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(Practitioner_Service);
    await wipeModelSequelize(Practitioner);
    await wipeModelSequelize(Service);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a Practitioner without id provided', async () => {
      const data = makeData();
      const practitioner = await Practitioner.create(data);
      expect(omitProperties(practitioner.get({ plain: true }), ['id'])).toMatchSnapshot();
    });

    test('should have null values for pmsId', async () => {
      const data = makeData();
      const practitioner = await Practitioner.create(data);
      expect(practitioner.pmsId).toBe(null);
    });

    test('should throw error for no accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      try {
        await Practitioner.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await Practitioner.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    test('should be able to fetch account relationship', async () =>  {
      const { id } = await Practitioner.create(makeData());
      const practitioner = await Practitioner.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(practitioner.accountId).toBe(practitioner.account.id);
    });

    describe('Pracitioner.services many2many', () => {
      let s1;
      let s2;
      let practitioner;
      let ps1;
      let ps2;
      beforeEach(async () => {
        await wipeModelSequelize(Practitioner_Service);
        await wipeModelSequelize(Practitioner);
        await wipeModelSequelize(Service);
        [s1, s2] = await Service.bulkCreate([
          makeServiceData({ name: 'S1' }),
          makeServiceData({ name: 'S2' }),
        ]);

        practitioner = await Practitioner.create(makeData());

        // Now add to the join table for this practitioner and their services
        [ps1, ps2] = await Practitioner_Service.bulkCreate([
          { serviceId: s1.id, practitionerId: practitioner.id },
          { serviceId: s2.id, practitionerId: practitioner.id },
        ]);
      });

      test('should be able to fetch the many services', async () =>  {
        const p = await Practitioner.findOne({
          where: { id: practitioner.id },
          include: [
            {
              model: Service,
              as: 'services',
            },
          ],
        });

        expect(p.services.length).toBe(2);
      });

      test('should be able to update the service relationships', async () => {
        await Practitioner_Service.destroy({ where: { id: ps2.id } });
        const p = await Practitioner.findOne({
          where: { id: practitioner.id },
          include: [
            {
              model: Service,
              as: 'services',
            },
          ],
        });


        expect(p.services.length).toBe(1);
      });
    });
  });
});

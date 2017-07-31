
import {
  Account,
  Practitioner,
  Practitioner_Service,
  Service,
} from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const makeData = (data = {}) => (Object.assign({
  name: 'Test Service',
  duration: 30,
  accountId,
}, data));

const makePractitionerData = (data = {}) => Object.assign({
  firstName: 'Test',
  lastName: 'Practitioner',
  accountId,
}, data);

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Service', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Service);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(Practitioner_Service);
    await wipeModelSequelize(Service);
    await wipeModelSequelize(Practitioner);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a Service without id provided', async () => {
      const data = makeData();
      const service = await Service.create(data);
      expect(omitProperties(service.get({ plain: true }), ['id'])).toMatchSnapshot();
    });

    test('should have null values for pmsId', async () => {
      const data = makeData();
      const service = await Service.create(data);
      expect(service.pmsId).toBe(null);
    });

    test('should throw error for no accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      try {
        await Service.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await Service.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    test('should be able to fetch account relationship', async () =>  {
      const { id } = await Service.create(makeData());
      const service = await Service.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(service.accountId).toBe(service.account.id);
    });

    describe('Service.practitioners many2many', () => {
      let p1;
      let p2;
      let service;
      let ps1;
      let ps2;
      beforeEach(async () => {
        await wipeModelSequelize(Practitioner_Service);
        await wipeModelSequelize(Service);
        await wipeModelSequelize(Practitioner);

        [p1, p2] = await Practitioner.bulkCreate([
          makePractitionerData({ firstName: 'Test1' }),
          makePractitionerData({ firstName: 'Test2' }),
        ]);

        service = await Service.create(makeData());

        // Now add to the join table for this practitioner and their services
        [ps1, ps2] = await Practitioner_Service.bulkCreate([
          { serviceId: service.id, practitionerId: p1.id },
          { serviceId: service.id, practitionerId: p2.id },
        ]);
      });

      test('should be able to fetch the many practitioners', async () =>  {
        const s = await Service.findOne({
          where: { id: service.id },
          include: [
            {
              model: Practitioner,
              as: 'practitioners',
            },
          ],
        });

        expect(s.practitioners.length).toBe(2);
      });

      test('should be able to update the service relationships', async () => {
        await Practitioner_Service.destroy({ where: { id: ps2.id } });
        const s = await Service.findOne({
          where: { id: service.id },
          include: [
            {
              model: Practitioner,
              as: 'practitioners',
            },
          ],
        });

        expect(s.practitioners.length).toBe(1);
      });
    });
  });
});

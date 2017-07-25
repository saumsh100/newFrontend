
import {
  Account,
  Practitioner,
  Practitioner_Service,
  Service,
} from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';

async function wipePractitionerTable() {
  await Practitioner.destroy({
    where: {},
    force: true,
  });
}

async function wipeAccountTable() {
  await Account.destroy({
    where: {},
    force: true,
  });
}

async function wipePractitionerServiceTable() {
  await Practitioner_Service.destroy({
    where: {},
    force: true,
  });
}

async function wipeServiceTable() {
  await Service.destroy({
    where: {},
    force: true,
  });
}

const accountId = 'e13151a6-091e-43db-8856-7e547c171754';
const makeData = (data = {}) => Object.assign({
  firstName: 'Test',
  lastName: 'Practitioner',
  accountId,
}, data);

const enterpriseId = 'ef3c578f-c228-4a25-8388-90ee9a0c9eb4';
const makeAccountData = (data = {}) => Object.assign({
  id: accountId,
  name: 'Test Account',
  enterpriseId,
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
    await wipePractitionerTable();
    await wipeAccountTable();
  });

  afterAll(async () => {
    await wipePractitionerTable();
    await wipeAccountTable();
  });

  describe('Data Validation', () => {
    test('should be able to save a Practitioner without id provided', async () => {
      const data = makeData();
      await Account.create(makeAccountData());
      const practitioner = await Practitioner.create(data);
      expect(omitProperties(practitioner.get({ plain: true }), ['id'])).toMatchSnapshot();
    });

    test('should have null values for pmsId', async () => {
      const data = makeData();
      await Account.create(makeAccountData());
      const practitioner = await Practitioner.create(data);
      expect(practitioner.pmsId).toBe(null);
    });

    test('should throw error for no accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      await Account.create(makeAccountData());
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
    beforeEach(async () => {
      await wipePractitionerTable();
      await wipeAccountTable();
    });

    afterAll(async () => {
      await wipePractitionerTable();
      await wipeAccountTable();
    });

    test('should be able to fetch account relationship', async () =>  {
      await Account.create(makeAccountData());
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
        await wipePractitionerServiceTable();
        await wipeServiceTable();
        await wipePractitionerTable();
        await wipeAccountTable();

        await Account.create(makeAccountData());
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

      afterEach(async () => {
        await wipePractitionerServiceTable();
        await wipeServiceTable();
        await wipePractitionerTable();
        await wipeAccountTable();
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

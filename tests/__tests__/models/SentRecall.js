
import { Account, Patient, Recall, SentRecall } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize } from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const patientId = '88a2d812-3a4c-454c-9286-628556563bdc';
const makePatientData = (data = {}) => (Object.assign({
  id: patientId,
  firstName: 'Justin',
  lastName: 'Sharp',
  accountId,
}, data));

const recallId = '99a2d812-3a4c-454c-9286-628556563bdc';
const makeRecallData = (data = {}) => (Object.assign({
  id: recallId,
  accountId,
  primaryType: 'sms',
  lengthSeconds: 7200,
}, data));

const makeData = (data = {}) => (Object.assign({
  accountId,
  recallId,
  patientId,
  primaryType: 'sms',
  lengthSeconds: 7200,
}, data));

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/SentRecall', () => {
  beforeEach(async () => {
    await wipeModelSequelize(SentRecall);
    await wipeModelSequelize(Recall);
    await wipeModelSequelize(Patient);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(SentRecall);
    await wipeModelSequelize(Recall);
    await wipeModelSequelize(Patient);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a SentRecall without id provided', async () => {
      const data = makeData();
      await Recall.create(makeRecallData());
      await Patient.create(makePatientData());
      const sentRecall = await SentRecall.create(data);
      expect(omitProperties(sentRecall.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should throw error for no accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      await Recall.create(makeRecallData());
      await Patient.create(makePatientData());
      try {
        await SentRecall.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      await Recall.create(makeRecallData());
      await Patient.create(makePatientData());
      try {
        await SentRecall.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    test('should be able to fetch account relationship', async () =>  {
      await Recall.create(makeRecallData());
      await Patient.create(makePatientData());
      const { id } = await SentRecall.create(makeData());
      const sentRecall = await SentRecall.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(sentRecall.accountId).toBe(sentRecall.account.id);
    });
  });
});

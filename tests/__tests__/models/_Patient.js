
import { Account, Patient } from '../../../server/_models';
import { wipeModelSequelize } from '../../util/wipeModel';
import { omitProperties } from '../../util/selectors';


// TODO: should probably make makeData, a reusable function

const accountId = 'ee3c578f-c228-4a25-8388-90ee9a0c9eb4';
const makeData = (data = {}) => (Object.assign({
  accountId,
  firstName: 'Justin',
  lastName: 'Sharp',
  email: 'justin@carecru.com',
  mobilePhoneNumber: '+18887774444',
}, data));

// TODO: this will have to change when we add relations to Account & Enterprise

const enterpriseId = 'ef3c578f-c228-4a25-8388-90ee9a0c9eb4';
const makeAccountData = (data = {}) => (Object.assign({
  id: accountId,
  name: 'Test Account',
  enterpriseId,
}, data));

describe('models/Patient', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Account);
    await wipeModelSequelize(Patient);
  });

  afterEach(async () => {
    await wipeModelSequelize(Account);
    await wipeModelSequelize(Patient);
  });

  describe('Data Validation', () => {
    test.only('should be able to save a Patient without id provided', async () => {
      const data = makeData();
      await Account.create(makeAccountData());
      const patient = await Patient.create(data);
      expect(omitProperties(patient.dataValues, ['id'])).toMatchSnapshot();
    });
  });
});

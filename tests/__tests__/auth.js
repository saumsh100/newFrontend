
import { UserAuth } from '../../server/lib/auth';
import {
  Account,
  Chair,
} from '../../server/models';
import { seedTestUsers } from '../util/seedTestUsers';
import wipeModel, { wipeAllModels } from '../util/wipeModel';
import { getModelsArray, omitProperties }  from '../util/selectors';

const managerEmail = 'manager@test.com';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

async function seedData() {
  await seedTestUsers();

  // Seed an extra account for fetching multiple and testing switching
  await Account.save({
    id: accountId2,
    enterpriseId,
    name: 'Test Account 2',
    createdAt: '2017-07-20T00:14:30.932Z',
  });
}

describe('auth lib', () => {
  // Seed with some standard user data
  beforeAll(async () => {
    await seedData();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#load', () => {
    test.only('should load the correct model', async () => {
      const user = await UserAuth.load(managerEmail);
      
      // Need to cleanse off properties here...
      expect(omitProperties(user._makeSavableCopy(), ['password'])).toMatchSnapshot();
    });

    /*test('should be falsey if user does not exist', async () => {
      const user = await UserAuth.load('ghost@test.com');

    });*/
  });

});

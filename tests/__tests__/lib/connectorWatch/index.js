import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { getAccountsConnectorDown } from '../../../../server/lib/connectorWatch';
import sendRecall from '../../../../server/lib/recalls/sendRecall';
import { Account } from '../../../../server/_models';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import {
  updateAccountConnectorConfigurations,
} from '../../../../server/lib/accountConnectorConfigurations';

describe('connectorWatch', () => {
  beforeAll(async () => {
    await wipeAllModels();
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('checkWhichAccountsAreReturned - only return between 30 min - 3 hour exclusive', () => {
    beforeEach(async () => {
      const lastSyncDate = moment({
        years: 2010,
        months: 3,
        date: 5,
        hours: 15,
        minutes: 10,
      });
      await updateAccountConnectorConfigurations({
        name: 'CONNECTOR_ENABLED',
        value: '1',
      }, '62954241-3652-4792-bae5-5bfed53d37b7');
      await Account.update({ lastSyncDate }, { where: {} });
    });

    test('should return 0 as last sync was 31 mins ago', async () => {
      const date = moment({
        years: 2010,
        months: 3,
        date: 5,
        hours: 15,
        minutes: 41,
      });
      const account = await getAccountsConnectorDown(date);

      expect(account.length).toBe(0);
    });

    test('should return 1 as last sync was 90 mins ago', async () => {
      const date = moment({
        years: 2010,
        months: 3,
        date: 5,
        hours: 17,
        minutes: 40,
      });
      const account = await getAccountsConnectorDown(date);

      expect(account.length).toBe(1);
    });

    test('should return 0 as last sync 3 hours ago', async () => {
      const date = moment({
        years: 2010,
        months: 3,
        date: 5,
        hours: 18,
        minutes: 10,
      });
      const account = await getAccountsConnectorDown(date);

      expect(account.length).toBe(0);
    });

    test('should return 1 as last sync 2 hours and 59 mins ago', async () => {
      const date = moment({
        years: 2010,
        months: 3,
        date: 5,
        hours: 18,
        minutes: 9,
      });
      const account = await getAccountsConnectorDown(date);

      expect(account.length).toBe(1);
    });
  });
});

import moment from 'moment';
import { Account } from '../../_models';
import { sendConnectorDown } from '../mail';
import { env, namespaces } from '../../config/globals';
import {
  getAccountConnectorConfigurations,
} from '../accountConnectorConfigurations';

/**
 * [connectorWatch watches the connector to see which is down]
 * @param  {[obectt]} io [socket io]
 * @return {[type]}    [description]
 */
export default async function connectorWatch(io) {
  const accounts = await getAccountsConnectorDown(moment());

  if (env === 'production') {
    for (let i = 0; i < accounts.length; i += 1) {
      const account = accounts[i];
      const timeInMins = moment().diff(account.lastSyncDate, 'minutes');
      restartConnector(account.id, io);
      sendConnectorDown({
        toEmail: 'monitoring@carecru.com',
        name: account.name,
        mergeVars: [
          {
            name: 'CONNECTOR_NAME',
            content: account.name,
          },
          {
            name: 'DOWN_TIME',
            content: `${timeInMins} mins`,
          },
        ],
      });
    }
  }
}

export async function getAccountsConnectorDown(date) {
  const currentTime = moment(date);
  const tenMinAgo = currentTime.clone().subtract(10, 'minutes');
  const threeHoursAgo = currentTime.clone().subtract(3, 'hours');

  const accounts = await Account.findAll({
    where: {
      lastSyncDate: {
        $ne: null,
        $gt: threeHoursAgo.toISOString(),
        $lt: tenMinAgo.toISOString(),
      },
      syncClientAdapter: null,
    },
  });

  const filteredAccounts = [];

  for (let i = 0; i < accounts.length; i += 1) {
    const configs = await getAccountConnectorConfigurations(accounts[i].id);

    for (let j = 0; j < configs.length; j += 1) {
      if (configs[j].name === 'CONNECTOR_ENABLED'
        && configs[j].value === '1') {
        filteredAccounts.push(accounts[i]);
      }
    }
  }

  return filteredAccounts;
}

async function restartConnector(accountId, io) {
  try {
    console.log(`Trying to reset CONNECTOR for ${accountId}`);

    return io.of(namespaces.sync).in(accountId).emit('CONFIG:REFRESH', 'reset');
  } catch (err) {
    return console.log(err);
  }
}

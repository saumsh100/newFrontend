import moment from 'moment';
import { Account, Configuration } from '../../_models';
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
      const adapterType = await getAccountAdapterType(accounts[i]);
      const timeInMins = moment().diff(account.lastSyncDate, 'minutes');
      restartConnector(account.id, io);
      sendConnectorDown({
        toEmail: 'monitoring@carecru.com',
        name: account.name,
        adapterType,
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

  const connectorFirstDownTime = await Configuration.find({
    raw: true,
    nest: true,
    where: {
      name: 'CONNECTOR_FIRST_DOWN_TIME',
    },
  });

  const firstDownTime = connectorFirstDownTime ? 
    parseInt(connectorFirstDownTime.defaultValue, 10) : 90;
  
  const currentTime = moment(date);
  const firstDownMinAgo = currentTime.clone().subtract(firstDownTime, 'minutes');
  const threeHoursAgo = currentTime.clone().subtract(3, 'hours');

  const accounts = await Account.findAll({
    where: {
      lastSyncDate: {
        $ne: null,
        $gt: threeHoursAgo.toISOString(),
        $lt: firstDownMinAgo.toISOString(),
      },
      syncClientAdapter: null,
    },
  });

  const filteredAccounts = [];

  for (let i = 0; i < accounts.length; i += 1) {
    const configs = await getAccountConnectorConfigurations(accounts[i].id);

    const connectorEnabled = configs.find(c => c.name === 'CONNECTOR_ENABLED').value;
    const monitoringEnabled = configs.find(c => c.name === 'MONITORING_ENABLED').value;

    if (connectorEnabled === '1' && monitoringEnabled === '1') {
      filteredAccounts.push(accounts[i]);
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

async function getAccountAdapterType(account) {
  const configs = await getAccountConnectorConfigurations(account.id);

  let adapterType;

  for (let j = 0; j < configs.length; j += 1) {
    if (configs[j].name === 'ADAPTER_TYPE') {
      adapterType = configs[j].value;
    }
  }
  return adapterType;
}

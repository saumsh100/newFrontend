import moment from 'moment';
import { Account } from '../../_models';
import { sendConnectorDown } from '../mail';
import { env } from '../../config/globals';

export default async function connectorWatch() {
  const accounts = await getAccountsConnectorDown(moment());

  if (env === 'production') {
    for (let i = 0; i < accounts.length; i += 1) {
      const account = accounts[i];
      const timeInMins = moment().diff(account.lastSyncDate, 'minutes');
      sendConnectorDown({
        toEmail: 'kirat@carecru.com',
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
    },
  });
  return accounts;
}

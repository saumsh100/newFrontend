import { CronConfiguration, AccountCronConfiguration } from '../../_models';


/**
 * [getAccountCronConfigurations returns the Cron Configs for an account. If they aren't there
 * return the defaults]
 * @param  {[type]} accountId [id of account]
 * @return {[type]}           Cron Configs for account
 */
export async function getAccountCronConfigurations(accountId) {
  const sendValues = [];
  const accountConfigs = await CronConfiguration.findAll({
    raw: true,
    nest: true,
    include: {
      model: AccountCronConfiguration,
      as: 'accountCronConfiguration',
      where: {
        accountId,
      },

      required: false,
    },
  });

  for (let i = 0; i < accountConfigs.length; i += 1) {
    const sendValue = {
      name: accountConfigs[i].name,
      description: accountConfigs[i].description,
      'data-type': accountConfigs[i].type,
      value: accountConfigs[i].defaultValue,
      id: accountConfigs[i].id,
    };

    if (accountConfigs[i].accountCronConfiguration.id) {
      sendValue.value = accountConfigs[i].accountCronConfiguration.value;
    }

    sendValues.push(sendValue);
  }

  return sendValues;
}

/**
 * [updateAccountCronConfigurations updates the Cron Config of an account]
 * @param  {[type]} configChange [object of config name and value to set]
 * @param  {[type]} accountId
 * @return {[type]}
 */
export async function updateAccountCronConfigurations(configChange, accountId) {
  const {
    name,
  } = configChange;

  const config = await CronConfiguration.findOne({
    where: { name },
  });

  const checkConfigExists = await AccountCronConfiguration.findOne({
    where: {
      accountId,
      cronConfigurationId: config.id,
    },
  });

  let newConfig;

  if (checkConfigExists) {
    newConfig = await checkConfigExists.update(configChange);
  } else {
    newConfig = await AccountCronConfiguration.create({
      accountId,
      cronConfigurationId: config.id,
      ...configChange,
    });
  }

  const accountConfig = newConfig.get({ plain: true });

  const sendValue = {
    name,
    description: config.description,
    'data-type': config.type,
    value: accountConfig.value,
    id: newConfig.id,
  };

  return sendValue;
}

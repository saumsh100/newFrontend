import { Configuration, AccountConfiguration } from '../../_models';
import { namespaces } from '../../config/globals';

/**
 * [getAccountConnectorConfigurations returns the Connector Configs for an account. If they aren't there
 * return the defaults]
 * @param  {[type]} accountId [id of account]
 * @return {[type]}           Connector Configs for account
 */
export async function getAccountConnectorConfigurations(accountId) {
  const sendValues = [];
  const accountConfigs = await Configuration.findAll({
    raw: true,
    nest: true,
    include: {
      model: AccountConfiguration,
      as: 'accountConfiguration',
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

    if (accountConfigs[i].accountConfiguration.id) {
      sendValue.value = accountConfigs[i].accountConfiguration.value;
    }

    sendValues.push(sendValue);
  }

  return sendValues;
}


/**
 * [updateAccountConnectorConfigurations updates the Connector Config of an account]
 * @param  {[object]} configChange [object of config name and value to set]
 * @param  {[uuid]} accountId
 * @return {[object]}
 */
export async function updateAccountConnectorConfigurations(configChange, accountId, io) {
  const {
    name,
  } = configChange;

  const config = await Configuration.findOne({
    where: { name },
  });

  const checkConfigExists = await AccountConfiguration.findOne({
    where: {
      accountId,
      configurationId: config.id,
    },
  });

  let newConfig;

  if (checkConfigExists) {
    newConfig = await checkConfigExists.update(configChange);
  } else {
    newConfig = await AccountConfiguration.create({
      accountId,
      configurationId: config.id,
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

  if (io) {
    io.of(namespaces.sync).in(accountId).emit('CONFIG:REFRESH', name);
  }

  return sendValue;
}

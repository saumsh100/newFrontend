
import LaunchDarkly from 'ldclient-node';
import globals from '../../config/globals';

let ldClient;

if (globals.env !== 'test') {
  ldClient = LaunchDarkly.init(globals.launchDarkly.sdkKey);
}

function ldClientVariation(featureFlag, defaultValue, { userId, ...data }) {
  if (globals.env === 'test') {
    return true;
  }

  const metaData = {
    key: userId,
    custom: {
      ...data,
    },
  };

  return new Promise((resolve, reject) => {
    ldClient.once('ready', () => {
      ldClient.variation(featureFlag, metaData, defaultValue, (err, showFeature) => {
        if (err) reject(err);
        return resolve(showFeature);
      });
    });
  });
}

/**
 * Checks if the feature specified by featureFlag is enabled for the user
 * @param String featureFlag - The identifier of the feature
 * @param Boolean defaultValue - The default value that is returned if non is retrieved
 * @param { String key, ...String} metaData  - Metadata ex: account id, enterprise id, etc.
 */
export default async function isFeatureEnabled(featureFlag, defaultValue, metaData) {
  return await ldClientVariation(featureFlag, defaultValue, metaData);
}

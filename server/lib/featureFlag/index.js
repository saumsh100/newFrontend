import LaunchDarkly from 'ldclient-node';
import globals from '../../config/globals';

const ldClient = LaunchDarkly.init(globals.launchDarkly.sdkKey);

function ldClientVariation(featureFlag, defaultValue, { userId, ...data }) {
  const metaData = {
    key: userId,
    custom: {
      ...data,
    },
  };

  return new Promise((resolve, reject) => {
    ldClient.variation(featureFlag, metaData, defaultValue, (err, showFeature) => {
      if (err) reject(err);
      return resolve(showFeature);
    });
  });
}

/**
 * Checks if the feature specified by featureFlag is enabled for the user
 * @param String featureFlag - The identifier of the feature
 * @param Boolean defaultValue - The default value that is returned if non is retrieved
 * @param { String key, ...String} metaData  - Metadata ex: account id, enterprise id, etc.
 */
async function isFeatureEnabled(featureFlag, defaultValue, metaData) {
  return await ldClientVariation(featureFlag, defaultValue, metaData);
}

export default isFeatureEnabled;

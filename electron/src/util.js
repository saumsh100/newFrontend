
module.exports.getChannelFromVersion = (version) => {
  const splitVersion = version.split('-');
  return splitVersion[1] || null;
};

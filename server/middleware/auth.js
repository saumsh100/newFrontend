
const basicAuth = require('basic-auth-connect');

const userWhitelist = {
  jsharp: '+n]Q83mX',
  ian: '+n]Q83mX',
  sergey: '+n]Q83mX',
  amol: '+n]Q83mX',
};

const auth = basicAuth((user, pass) => {
  return userWhitelist[user] && userWhitelist[user] === pass;
});

module.exports = auth;

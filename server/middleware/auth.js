
const basicAuth = require('basic-auth-connect');

const userWhitelist = {
  jsharp: '+n]Q83mX',
  ian: '~6p>Dj_7',
  sergey: 'xjp/S9S2',
  amol: 'Whj(+9[<',
};

const auth = basicAuth((user, pass) => {
  return userWhitelist[user] && userWhitelist[user] === pass;
});

module.exports = auth;
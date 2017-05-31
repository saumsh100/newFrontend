const axios = require('axios');
const querystring = require('querystring');
const { isObject } = require('lodash');
const OAuth = require('../../models/OAuth');
const globals = require('../../config/globals');
const authRouter = require('express').Router();

authRouter.get('/facebook', ({ query: { code, error } }, res, next) => {
  if (!code || error) {
    // TODO: proper error handling
    next(new Error(error || 'Login failed'));
  }

  const { port, host } = globals;

  // TODO: we have to support (only?) https protocol in a feature
  const redirectUri =
    `http://my.${host}:${port}/oauth/facebook`;

  const fbApi = (path, query = false) => {
    const optionPart = isObject(query) ? `?${querystring.stringify(query)}` : '';
    return axios.get(`https://graph.facebook.com${path}${optionPart}`);
  };

  const options = {
    client_id: process.env.FACEBOOK_APP_ID,
    redirect_uri: redirectUri,
    client_secret: process.env.FACEBOOK_APP_SECRET,
    code,
  };

  const respond = data =>
    res.send(`<script>window.opener.oauthHandler(${JSON.stringify(data)});</script>`);

  fbApi('/oauth/access_token', options)
    .then(({ data: { access_token } }) =>
      fbApi('/me', { access_token, fields: ['email', 'first_name', 'last_name'].join(',') })
    )
    .then((userData) =>
      // Check is connection exists
      OAuth.filter({ provider: 'FACEBOOK', providerUserId: userData.id }).getJoin({ patient: true }).run()
        .then(([token]) => {
          if (token && token.patient) {
            respond({ patientId: token.patient.id, status: 'exists' });
          } else {

          }
        })
    )
    .catch((e) => {
      console.error(e);
      res.send(503, e.message);
    });
});

module.exports = authRouter;

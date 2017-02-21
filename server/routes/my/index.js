
const apiRouter = require('express').Router();
const myRouter = require('express').Router();
const practitionersRouter = require('../api/practitioners');
const loaders = require('../util/loaders');

apiRouter.use('/practitioners', practitionersRouter);

myRouter.get('/', (req, res, next) => {
  console.log('loggg');
  return res.render('patient');
});

myRouter.param('accountId', loaders('account', 'Account'));

myRouter.get('/widgets/:accountId', (req, res, next) => {

  /*Service.filter({ accountId })
    .then(services => {
      Practitioners.filter({ account })
        .then( practionners => {
          return res.render('widget', {
            services,
            practiotin,
            account: req.account,
          });

        })
    })*/

  return res.render('widget', {
    accountId: req.params.accountId,
  });
});

myRouter.use(apiRouter);

module.exports = myRouter;

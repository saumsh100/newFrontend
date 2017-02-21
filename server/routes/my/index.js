
const apiRouter = require('express').Router();
const myRouter = require('express').Router();
const practitionersRouter = require('../api/practitioners');

apiRouter.use('/practitioners', practitionersRouter);

myRouter.get('/', (req, res, next) => {
  console.log('loggg');
  return res.render('patient');
});

myRouter.get('/widgets/:accountId', (req, res, next) => {
  console.log('log');
  return res.render('widget', {
    accountId: req.params.accountId,
  });
});

myRouter.use(apiRouter);

module.exports = myRouter;


const apiRouter = require('express').Router();
const myRouter = require('express').Router();
const practitionersRouter = require('../api/practitioners');

apiRouter.use('/practitioners', practitionersRouter);

myRouter.get('/:accountId', (req, res, next) => {
  console.log(req.params.accountId);
  return res.render('patient', {
    accountId: req.params.accountId,
  });
});

myRouter.get('/widgets/:accountId', (req, res, next) => {
  return res.render('widget', {
    accountId: req.params.accountId,
  });
});

myRouter.use(apiRouter);

module.exports = myRouter;


const apiRouter = require('express').Router();
const myRouter = require('express').Router();
const practitionersRouter = require('../api/practitioners');

apiRouter.use('/practitioners', practitionersRouter);

myRouter.get('/', (req, res, next) => {
  return res.render('patient');
});

myRouter.use(apiRouter);

module.exports = myRouter;

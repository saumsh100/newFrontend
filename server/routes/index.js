 
const rootRouter = require('express').Router();

rootRouter.get('(/*)?', (req, res, next) => {
  return res.render('app');
});

module.exports = rootRouter;

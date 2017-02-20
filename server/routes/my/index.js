
const myRouter = require('express').Router();

myRouter.get('/', (req, res, next) => {
  return res.render('patient');
});

module.exports = myRouter;

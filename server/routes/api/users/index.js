const { normalize, Schema, arrayOf } = require('normalizr');
const userRouter = require('express').Router();
const User = require('../../../models/User');

const userSchema = new Schema('users');


userRouter.get('/', (req, res, next) => {
  //res.send(req);
})

module.exports = userRouter;

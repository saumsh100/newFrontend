const express = require('express');

const { onlineBookingApp } = require('../config');

const myRouter = express.Router();

myRouter.get('/my(/*)?', async (req, res, next) => {
  res.sendFile(onlineBookingApp);
});

module.exports = myRouter;

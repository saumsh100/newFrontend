
const callsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const { r } = require('../../../config/thinky');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
import Call from '../../../models/Call';
import Account from '../../../models/Account';

//callsRouter.param('callId', loaders('request', 'Request'));

/**
 * Receive a call from CallRail's webhook API
 */
callsRouter.post('/', (req, res, next) => {
  try {
    console.log(req.body);
  } catch (err) {
    next(err);
  }
});

callsRouter.get('/', (req, res, next) => {
  const {
    query,
  } = req;

  let {
    startDate,
    endDate,
    accountId,
  } = query;

  const send = {
    total: 0,
    pickup: 0,
    booked: 0,
  };

  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);

  Account.get(accountId)
    .then((account) => {
      Call
      .filter({ destinationnum: account.twilioPhoneNumber })
      .filter(r.row('datetime').during(startDate, endDate))
      .then((calls) => {
        calls.map((call) => {
          send.total++;
          if (call.answered) {
            send.pickup++;
          }
          if (call.wasApptBooked) {
            send.booked++;
          }
          return null;
        });
        res.send(send);
      });
    })
    .catch(next);
});

module.exports = callsRouter;

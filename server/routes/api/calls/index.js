
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
    accountId,
  } = req;

  let {
    startDate,
    endDate,
  } = query;

  const send = {
    total: 0,
    pickup: 0,
    booked: 0,
    webTotal: 0,
    webPickup: 0,
    webBooked: 0,
  };

  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);

  Account.get(accountId)
    .then((account) => {
      const destinationnum = account.destinationPhoneNumber;
      if (!destinationnum) {
        return res.send(send);
      }
      return Call
      .filter(r.row('datetime').during(startDate, endDate))
      .filter({ destinationnum })
      .then((calls) => {
        calls.map((call) => {
          send.total++;
          if (call.answered) {
            send.pickup++;
          }
          if (call.wasApptBooked) {
            send.booked++;
          }
          if (call.callsource !== 'direct') {
            send.webTotal++;
            if (call.answered) {
              send.webPickup++;
            }
            if (call.wasApptBooked) {
              send.webBooked++;
            }
          }
          return null;
        });
        res.send(send);
      });
    })
    .catch(next);
});

module.exports = callsRouter;

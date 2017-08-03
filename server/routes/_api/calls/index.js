
const callsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');

import { Call, Account } from '../../../_models/';
import moment from 'moment';


//callsRouter.param('callId', loaders('request', 'Request'));

const generateDuringFilterSequelize = (startDate, endDate) => {
  return {
    $or: [
      {
        startDate: {
          gt: new Date(startDate).toISOString(),
          lt: new Date(endDate).toISOString(),
        },
      },
      {
        endDate: {
          gt: new Date(startDate).toISOString(),
          lt: new Date(endDate).toISOString(),
        },
      },
    ],
  };
};

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

  startDate = startDate ? moment(startDate).toISOString() : moment().subtract(1, 'years').toISOString();
  endDate = endDate ? moment(endDate).toISOString() : moment().toISOString();

  Account.findOne({
    where: { id: accountId },
    raw: true,
    // where: generateDuringFilterSequelize(startDate, endDate)
  }).then((account) => {
    const destinationNum = account.destinationPhoneNumber;
    if (!destinationNum) {
      return res.send(send);
    }
    return Call.findAll({
      where: {
        destinationNum,
        dateTime: {
          gt: new Date(startDate).toISOString(),
          lt: new Date(endDate).toISOString(),
        },
      },
      raw: true,
    })
    .then((calls) => {
      calls.map((call) => {
        send.total++;
        if (call.answered) {
          send.pickup++;
        }
        if (call.wasApptBooked) {
          send.booked++;
        }
        if (call.callSource !== 'direct') {
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

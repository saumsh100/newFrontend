import moment from 'moment';
import { Call, Account } from '../../../_models/';

import { sequelizeLoader } from '../../util/loaders';

const callsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');

callsRouter.param('callId', sequelizeLoader('call', 'Call'));

const generateDuringFilterSequelize = (startDate, endDate) => {
  return {
    startTime: {
      $between: [
        new Date(startDate),
        new Date(endDate),
      ],
    },
  };
};

/**
 * GET /api/calls
 *
 * query parameters:
 *      ?startDate=:Date
 *      ?endDate=:Date
 *      ?noNormalizer=:boolean
 *      ?limit=:number
 *      ?skip=:number
 *
 * @returns 200 A list of calls sorted in decending order
 *          401 If not logged in
 */
callsRouter.get('/', (req, res, next) => {
  const {
    query,
    accountId,
    includeArray,
  } = req;

  const {
    startDate,
    endDate,
    noNormalizer,
    skip,
    limit,
  } = query;

  const limits = limit && skip ? { limit, offset: skip } : {};

  const include = includeArray.map((included) => {
    if (included.as === 'patient') {
      return {
        ...include,
        required: false,
      };
    }

    return include;
  });

  const range = startDate && endDate ? generateDuringFilterSequelize(startDate, endDate) : {};

  return Call.findAll({
    where: {
      accountId,
      ...range,
    },

    ...limits,
    raw: true,
    nest: true,
    include,
    order: [['startTime', 'DESC']],
  })
  .then((calls) => {
    calls = noNormalizer ? calls : normalize('calls', calls);
    return res.send(calls);
  })
  .catch(next);
});

 /**
  * PUT /api/calls/:callId
  * body
  * query parameters:
  *      ?startDate=:Date
  *      ?endDate=:Date
  *      ?noNormalizer=:boolean
  *      ?limit=:number
  *      ?skip=:number
  *
  * @returns 201 Update for tag and appointment Booked
  *          401 If not logged in
  */
callsRouter.put('/:callId', (req, res, next) => {
  return req.call.update(req.body)
    .then((call) => {
      const normalized = normalize('call', call.dataValues);
      return res.status(201).send(normalized);
    }).catch(next);
});

/**
 * GET /api/calls/statsgraph
 * body
 * query parameters:
 *      ?startDate=:Date
 *      ?endDate=:Date
 *
 * @returns 200  gives x, y values for a call data for a given startDate and end Date
 *          400 If not startDate and/or EndDate
 *          401 If not logged in
 */
callsRouter.get('/statsgraph', (req, res, next) => {
  const {
    query,
    accountId,
  } = req;

  const {
    startDate,
    endDate,
  } = query;

  if (!startDate || !endDate) {
    return res.send(400);
  }

  const range = generateDuringFilterSequelize(startDate, endDate);

  return Call.findAll({
    where: {
      accountId,
      ...range,
    },
    raw: true,
  }).then((calls) => {
    // TODO: handle with one query or extract to a function for testing.

    const send = {
      xValues: [],
      yValues: [],
    };

    const graphData = {};
    const startTime = moment(startDate);
    graphData[startTime.format('MMM DD')] = 0;

    // define x values
    while (!startTime.isAfter(endDate)) {
      startTime.add(1, 'days');
      graphData[startTime.format('MMM DD')] = 0;
    }

    // pupulate y values
    calls.forEach((call) => {
      if (graphData[moment(call.startTime).format('MMM DD')] >= 0) {
        graphData[moment(call.startTime).format('MMM DD')] += 1;
      }
    });

    send.xValues = Object.keys(graphData);

    send.xValues.forEach((x) => {
      send.yValues.push(graphData[x]);
    });

    return res.send(send);
  })
  .catch(next);
});

/**
 * GET /api/calls/stats
 * body
 * query parameters:
 *      ?startDate=:Date
 *      ?endDate=:Date
 *
 * @returns 200  gives call stats during startDate and endDate (or last year)
 *          401 If not logged in
 */
callsRouter.get('/stats', (req, res, next) => {
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
    where: {
      id: accountId,
    },
    raw: true,
  }).then((account) => {
    const destinationNum = account.destinationPhoneNumber;
    if (!destinationNum) {
      return res.send(send);
    }
    return Call.findAll({
      where: {
        destinationNum,
        startTime: {
          gt: new Date(startDate).toISOString(),
          lt: new Date(endDate).toISOString(),
        },
      },
      raw: true,
    })
    .then((calls) => {
      // TODO: handle with one query or extract to a function for testing.
      const regCheck = /direct/i;
      calls.map((call) => {
        send.total += 1;
        if (call.answered) {
          send.pickup += 1;
        }
        if (call.wasApptBooked) {
          send.booked += 1;
        }
        if (regCheck.test(call.callSource)) {
          send.webTotal += 1;
          if (call.answered) {
            send.webPickup += 1;
          }
          if (call.wasApptBooked) {
            send.webBooked += 1;
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


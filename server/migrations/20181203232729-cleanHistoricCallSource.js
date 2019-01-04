const axios = require('axios');
const moment = require('moment');
const globals = require('../config/globals');

const CALL_RAIL_URL = `https://api.callrail.com/v2/a/${globals.callrails.apiAccount}`;

function generateCallRailRequestHeaders() {
  return { Authorization: `Token token=${globals.callrails.apiKey}` };
}

async function makeCallRailRequest({ method, url, data, params }) {
  return axios({
    method,
    url,
    headers: generateCallRailRequestHeaders(),
    data,
    params,
    json: true,
  });
}

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        const [keywordCalls] =
          await queryInterface.sequelize.query('SELECT * FROM "Calls" WHERE "callSource"=\'keyword\'', { transaction });

        if (keywordCalls.length === 0) {
          return;
        }

        const calls = [];

        /* eslint-disable no-await-in-loop */
        let page = 1;
        let totalPages;
        do {
          const data = await makeCallRailRequest({
            method: 'GET',
            url: `${CALL_RAIL_URL}/calls.json?fields=formatted_tracking_source&page=${page}&date_range=all_time`,
          });

          Array.prototype.push.apply(calls, data.data.calls);

          page += 1;
          totalPages = data.data.total_pages;
        } while (page <= totalPages);

        let matchesFound = 0;

        for (let i = 0; i < keywordCalls.length; i += 1) {
          const keywordCall = keywordCalls[i];

          let matchFound = false;

          for (let j = 0; j < calls.length; j += 1) {
            const call = calls[j];

            if (!matchFound
              && keywordCall.callerNum === call.customer_phone_number
              && keywordCall.destinationNum === call.business_phone_number
              && moment(keywordCall.startTime).isSame(moment(call.start_time))) {
              await queryInterface.sequelize.query(`UPDATE "Calls" SET "callSource" = '${call.formatted_tracking_source}' WHERE "id" = '${keywordCall.id}'`, { transaction });
              matchesFound += 1;
              matchFound = true;
              break;
            }
          }

          if (!matchFound) {
            console.log(`Match not found for call with id: ${keywordCall.id}`);
            console.log(keywordCall);
          }
        }

        console.log(`Updated ${matchesFound} calls`);
      } catch (error) {
        console.error(error);
        transaction.rollback();
      }
    });
  },

  down: () => Promise.resolve(),
};

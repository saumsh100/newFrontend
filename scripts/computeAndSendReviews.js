
import { sequelize } from '../server/_models';
import groupBy from 'lodash/groupBy';
// import wipeModel from '../tests/_util/wipeModel';
// import { sendReviewsForAccount } from '../server/lib/reviews';
import groupPatientsByChannelPoc from '../server/lib/contactInfo/groupPatientsByChannelPoc';

const DATE = (new Date(2018, 1, 12, 14)).toISOString();
const ACCOUNT_ID = '62954241-3652-4792-bae5-5bfed53d37b7'; // Liberty Chiro

async function main() {
  try {
    //await wipeModel(SentReview);
    //await wipeModel(Review);
    const date = DATE;
    //const account = await Account.findById(ACCOUNT_ID);




    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

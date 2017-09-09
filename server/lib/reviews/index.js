
import { Account, Appointment, Patient, SentReview } from '../../_models';
import moment from 'moment';
import normalize from '../../routes/api/normalize';
import { sanitizeTwilioSmsData } from '../../routes/twilio/util';
import { getReviewAppointments } from './helpers';
import sendReminder from './sendReminder';


export async function sendReviewsForAccount(account, date) {
  console.log(`Sending reviews for ${account.name}`);

  // - grab all appointments that need a review
  //    - what does this mean?
  //    - date range from (date - 3) to (date - 2)
  //    - filter out the ones that have already been sent a review
  //    - filter out patients that have already been sent a review
  //    -


  /*
     - ignore appt. if:
        - not in range
        - patient has already left a Review for clinic
        - patient has already been sent a SentReview for that appointment
   */

  const appointments = await getReviewAppointments(account, date);
  for (const appointment of appointments) {
    const { patient } = appointment;


    // Save sent review first so we can
    // - use sentReviewId as token in email to identify patient on review form
    // - keep track of failed review comms
    const sentReview = await SentReview.create({
      accountId: account.id,
      practitionerId: appointment.practitionerId,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
    });

    debugger;


  }
}

/**
 *
 * @returns {Promise.<Array|*>}
 */
export async function computeReviewsAndSend({ date }) {
  // Fetch accounts that have reviews turned on
  const accounts = await Account.findAll({
    where: {
      canSendReviews: true,
    },
  });

  for (const account of accounts) {
    await sendReviewsForAccount(account, date);
  }
}

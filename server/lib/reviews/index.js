
import { Account, Appointment, Patient, SentReview } from '../../_models';
import moment from 'moment';
import normalize from '../../routes/api/normalize';
import { sanitizeTwilioSmsData } from '../../routes/twilio/util';
import { getReviewAppointments } from './helpers';
import sendReview from './sendReview';

export async function sendReviewsForAccount(account, date) {
  console.log(`Sending reviews for ${account.name}`);
  const appointments = await getReviewAppointments({ account, date });
  for (const appointment of appointments) {
    const { patient, practitioner } = appointment;

    // Save sent review first so we can
    // - use sentReviewId as token in email to identify patient on review form
    // - keep track of failed review comms
    const sentReview = await SentReview.create({
      accountId: account.id,
      practitionerId: appointment.practitionerId,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
    });

    try {
      await sendReview['email']({
        patient,
        account,
        appointment,
        sentReview,
        practitioner,
      });
    } catch (error) {
      console.log(`${'email'} review failed to send to ${patient.firstName} ${patient.lastName} for ${account.name}`);
      console.log(error);
      continue;
    }

    // If sendReview was successful, then update isSent
    await sentReview.update({ isSent: true });
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

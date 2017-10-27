
import {
  Account,
  Appointment,
  Patient,
  SentReview,
} from '../../_models';
import moment from 'moment';
import normalize from '../../routes/api/normalize';
import { sanitizeTwilioSmsData } from '../../routes/twilio/util';
import { getReviewPatients } from './helpers';
import sendReview from './sendReview';

export async function sendReviewsForAccount(account, date) {
  console.log(`Sending reviews for ${account.name}`);

  const { success, errors } = await getReviewPatients({ account, date });
  try {
    console.log(`Trying to bulkSave ${errors.length} failed sentReviews for ${account.name}`);

    // Save failed sentRecalls from errors
    const failedSentReviews = errors.map(({ errorCode, patient }) => ({
      accountId: account.id,
      practitionerId: patient.appointment.practitionerId,
      patientId: patient.id,
      appointmentId: patient.appointment.id,
      errorCode,
    }));

    await SentReview.bulkCreate(failedSentReviews);
  } catch (err) {
    console.error(`FAILED bulkSave of failed sentReviews`, err);
    // TODO: do we want to throw the error hear and ignore trying to send?
  }

  console.log(`Trying to send ${success.length} review emails for ${account.name}`);

  for (const patient of success) {
    const { appointment } = patient;
    const { practitioner } = appointment;

    // Save sent review first so we can
    // - use sentReviewId as token in email to identify patient on review form
    // - keep track of failed review comms
    const sentReview = await SentReview.create({
      accountId: account.id,
      practitionerId: appointment.practitionerId,
      patientId: patient.id,
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
    await exports.sendReviewsForAccount(account, date);
  }
}

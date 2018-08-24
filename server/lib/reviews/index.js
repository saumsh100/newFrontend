
import moment from 'moment';
import {
  Account,
  SentReview,
} from '../../_models';
import { getReviewPatients } from './helpers';
import sendReview from './sendReview';

export async function sendReviewsForAccount(account, date, pub) {
  const { name } = account;
  console.log(`Sending reviews for ${name} (${account.id}) at ${moment(date).format('YYYY-MM-DD h:mma')}...`);

  const { success, errors } = await getReviewPatients({
    account,
    startDate: date,
  });
  try {
    console.log(`---- ${errors.length} => sentReviews that would fail`);

    // Save failed sentRecalls from errors
    const failedSentReviews = errors.map(({ errorCode, patient }) => ({
      accountId: account.id,
      practitionerId: patient.appointment.practitionerId,
      patientId: patient.id,
      appointmentId: patient.appointment.id,
      errorCode,
    }));

    await SentReview.bulkCreate(failedSentReviews);
    console.log(`------ ${errors.length} => saved sentReviews that would fail`);
  } catch (err) {
    console.error('------ Failed bulk saving of sentReviews that would fail');
    console.error(err);
  }

  console.log(`---- ${success.length} review requests that should succeed`);

  const sentReviewIds = [];
  for (const { patient, primaryType } of success) {
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
      primaryType,
    });

    try {
      await sendReview[primaryType]({
        patient,
        account,
        appointment,
        sentReview,
        practitioner,
      });

      sentReviewIds.push(sentReview.id);

      console.log(`------ Sent '${primaryType}' review request to ${patient.firstName} ${patient.lastName}`);
    } catch (error) {
      console.error(`------ Failed sending '${primaryType}' review request to ${patient.firstName} ${patient.lastName}`);
      console.error(error);
      continue;
    }

    // If sendReview was successful, then update isSent
    await sentReview.update({ isSent: true });
  }

  pub && pub.publish('REVIEW:SENT:BATCH', JSON.stringify(sentReviewIds));
  console.log(`Reviews completed for ${name} (${account.id})!`);
}

/**
 *
 * @returns {Promise.<Array|*>}
 */
export async function computeReviewsAndSend({ date, pub }) {
  // Fetch accounts that have reviews turned on
  const accounts = await Account.findAll({ where: { canSendReviews: true } });

  // Be sure it runs on the minute
  date = moment(date).seconds(0).milliseconds(0).toISOString();

  for (const account of accounts) {
    await exports.sendReviewsForAccount(account, date, pub);
  }
}

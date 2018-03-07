
import {
  Account,
  Appointment,
  Correspondence,
  SentReminder,
  SentRecall,
  SentReview,
  Review,
  Reminder,
} from '../../_models';
import { namespaces } from '../../config/globals';
import {
  reminderSent,
  reminderConfirmed,
  recallSent,
  reviewSent,
  reviewCompleted,
} from './correspondenceNote';
import batchCreate from '../../routes/util/batch';
import bumpPendingAppointment from './bumpPendingAppointment';

async function computeRemindersCorrespondencesAndCreate(accountId) {
  let correspondences = await Correspondence.findAll({
    paranoid: false,
    where: {
      accountId,
      type: Correspondence.REMINDER_SENT_TYPE,
      sentReminderId: { $ne: null },
    },
  });

  const sentReminderIds = correspondences.map(c => c.sentReminderId);
  const sentReminders = await SentReminder.findAll({
    where: {
      accountId,
      isSent: true,
      id: { $notIn: sentReminderIds },
    },

    include: [{ model: Reminder, as: 'reminder' }],
  });

  const correspondencesToCreate = sentReminders.map((sr) => {
    return {
      accountId: sr.accountId,
      patientId: sr.patientId,
      sentReminderId: sr.id,
      appointmentId: sr.appointmentId,
      method: sr.primaryType,
      type: Correspondence.REMINDER_SENT_TYPE,
      contactedAt: sr.createdAt,
      note: reminderSent(sr),
    };
  });

  correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');

  if (correspondences[0]) {
    correspondences = correspondences.map(c => c.id);
    console.log(`Sending ${Correspondence.REMINDER_SENT_TYPE} ${correspondences.length} correspondences for account=${accountId}`);
    global.io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', correspondences);
  }
}

async function computeRemindersConfirmedCorrespondencesAndCreate(accountId) {
  let correspondences = await Correspondence.findAll({
    paranoid: false,
    where: {
      accountId,
      type: Correspondence.REMINDER_CONFIRMED_TYPE,
      sentReminderId: { $ne: null },
    },
  });

  const sentReminderIds = correspondences.map(c => c.sentReminderId);
  const sentReminders = await SentReminder.findAll({
    where: {
      accountId,
      isSent: true,
      id: { $notIn: sentReminderIds },
      isConfirmed: true,
    },

    include: [{ model: Reminder, as: 'reminder' }],
  });

  const correspondencesToCreate = sentReminders.map((sr) => {
    return {
      accountId: sr.accountId,
      patientId: sr.patientId,
      sentReminderId: sr.id,
      appointmentId: sr.appointmentId,
      method: sr.primaryType,
      type: Correspondence.REMINDER_CONFIRMED_TYPE,
      contactedAt: sr.updatedAt,
      note: reminderConfirmed(sr),
    };
  });

  correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');

  if (correspondences[0]) {
    correspondences = correspondences.map(c => c.id);
    console.log(`Sending ${Correspondence.REMINDER_CONFIRMED_TYPE} ${correspondences.length} correspondences for account=${accountId}`);
    global.io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', correspondences);
  }
}

async function computeRecallsCorrespondencesAndCreate(accountId) {
  let correspondences = await Correspondence.findAll({
    where: {
      accountId,
      type: Correspondence.RECALL_SENT_TYPE,
      sentRecallId: {
        $ne: null,
      },
    },
    paranoid: false,
  });

  const sentRecallsIds = correspondences.map(c => c.sentReminderId);

  const sentRecalls = await SentRecall.findAll({
    where: {
      accountId,
      isSent: true,
      id: {
        $notIn: sentRecallsIds,
      },
    },
  });

  const correspondencesToCreate = [];
  for (let i = 0; i < sentRecalls.length; i += 1) {
    const recall = sentRecalls[i];
    const appointmentId = await bumpPendingAppointment(recall.id);

    correspondencesToCreate.push({
      accountId: recall.accountId,
      patientId: recall.patientId,
      sentRecallId: recall.id,
      appointmentId,
      type: Correspondence.RECALL_SENT_TYPE,
      method: recall.primaryType,
      contactedAt: recall.createdAt,
      note: recallSent(recall),
    });
  }

  correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');

  if (correspondences[0]) {
    correspondences = correspondences.map(c => c.id);

    console.log(`Sending ${Correspondence.RECALL_SENT_TYPE} ${correspondences.length} correspondences for account=${accountId}`);

    global.io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', correspondences);
  }
}

async function computeReviewsCorrespondencesAndCreate(accountId) {
  let correspondences = await Correspondence.findAll({
    paranoid: false,
    where: {
      accountId,
      type: Correspondence.REVIEW_SENT_TYPE,
      sentReviewId: { $ne: null },
    },
  });

  const sentReviewsIds = correspondences.map(c => c.sentReviewId);
  const sentReviews = await SentReview.findAll({
    where: {
      accountId,
      isSent: true,
      id: { $notIn: sentReviewsIds },
    },
  });

  const correspondencesToCreate = sentReviews.map((sentReview) => {
    return {
      type: Correspondence.REVIEW_SENT_TYPE,
      accountId: sentReview.accountId,
      patientId: sentReview.patientId,
      sentReviewId: sentReview.id,
      appointmentId: sentReview.appointmentId,
      method: sentReview.primaryType,
      contactedAt: sentReview.createdAt,
      note: reviewSent(sentReview),
    };
  });

  correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');
  if (correspondences[0]) {
    correspondences = correspondences.map(c => c.id);
    console.log(`Sending ${correspondences.length} ${Correspondence.REVIEW_SENT_TYPE} correspondences for account=${accountId}`);
    global.io && global.io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', correspondences);
  }
}

async function computeReviewsCompletedCorrespondencesAndCreate(accountId) {
  let correspondences = await Correspondence.findAll({
    paranoid: false,
    where: {
      accountId,
      type: Correspondence.REVIEW_COMPLETED_TYPE,
      sentReviewId: { $ne: null },
    },
  });

  const sentReviewIds = correspondences.map(c => c.sentReviewId);
  const sentReviews = await SentReview.findAll({
    where: {
      accountId,
      isSent: true,
      id: { $notIn: sentReviewIds },
      isCompleted: true,
    },

    include: [{
      model: Review,
      as: 'review',
      required: true,
    }],
  });

  const correspondencesToCreate = sentReviews.map((sr) => {
    return {
      accountId: sr.accountId,
      patientId: sr.patientId,
      sentReviewId: sr.id,
      appointmentId: sr.appointmentId,
      method: sr.primaryType,
      type: Correspondence.REVIEW_COMPLETED_TYPE,
      contactedAt: sr.review.createdAt,
      note: reviewCompleted(sr),
    };
  });

  correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');

  if (correspondences[0]) {
    correspondences = correspondences.map(c => c.id);
    console.log(`Sending ${correspondences.length} ${Correspondence.REVIEW_COMPLETED_TYPE} correspondences for account=${accountId}`);
    global.io && global.io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', correspondences);
  }
}

export default async function computeCorrespondencesAndCreate() {
  const accounts = await Account.findAll({});
  for (const account of accounts) {
    // Reminders Sent and Confirmed
    computeRemindersCorrespondencesAndCreate(account.id);
    computeRemindersConfirmedCorrespondencesAndCreate(account.id);

    // Recalls Sent
    computeRecallsCorrespondencesAndCreate(account.id);

    // Reviews Sent and Completed
    computeReviewsCorrespondencesAndCreate(account.id);
    computeReviewsCompletedCorrespondencesAndCreate(account.id);
  }
}

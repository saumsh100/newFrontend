import { Account, SentReminder, SentRecall, Correspondence } from '../../_models';
import { namespaces } from '../../config/globals';
import batchCreate from '../../routes/util/batch';

async function computeRemindersCorrespondencesAndCreate(accountId) {
  let correspondences = await Correspondence.findAll({
    where: {
      accountId,
      type: Correspondence.REMINDER_SENT_TYPE,
      sentReminderId: {
        $ne: null,
      },
    },
    paranoid: false,
  });

  const sentReminderIds = correspondences.map(c => c.sentReminderId);

  const sentreminders = await SentReminder.findAll({
    where: {
      accountId,
      id: {
        $notIn: sentReminderIds,
      },
    },
  });

  const correspondencesToCreate = sentreminders.map((sr) => {
    return {
      accountId: sr.accountId,
      patientId: sr.patientId,
      sentReminderId: sr.id,
      appointmentId: sr.appointmentId,
      method: sr.primaryType,
      type: Correspondence.REMINDER_SENT_TYPE,
      contactedAt: sr.createdAt,
      note: Correspondence.REMINDER_SENT_NOTE,
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
    where: {
      accountId,
      type: Correspondence.REMINDER_CONFIRMED_TYPE,
      sentReminderId: {
        $ne: null,
      },
    },
    paranoid: false,
  });

  const sentReminderIds = correspondences.map(c => c.sentReminderId);

  const sentreminders = await SentReminder.findAll({
    where: {
      accountId,
      id: {
        $notIn: sentReminderIds,
      },
      isConfirmed: true,
    },
  });

  const correspondencesToCreate = sentreminders.map((sr) => {
    return {
      accountId: sr.accountId,
      patientId: sr.patientId,
      sentReminderId: sr.id,
      appointmentId: sr.appointmentId,
      method: sr.primaryType,
      type: Correspondence.REMINDER_CONFIRMED_TYPE,
      contactedAt: sr.updatedAt,
      note: Correspondence.REMINDER_CONFIRMED_NOTE,
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
      id: {
        $notIn: sentRecallsIds,
      },
    },
  });

  const correspondencesToCreate = sentRecalls.map((recall) => {
    return {
      accountId: recall.accountId,
      patientId: recall.patientId,
      sentRecallId: recall.id,
      type: Correspondence.RECALL_SENT_TYPE,
      method: recall.primaryType,
      contactedAt: recall.createdAt,
      note: Correspondence.RECALL_SENT_NOTE,
    };
  });

  correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');

  if (correspondences[0]) {
    correspondences = correspondences.map(c => c.id);

    console.log(`Sending ${Correspondence.RECALL_SENT_TYPE} ${correspondences.length} correspondences for account=${accountId}`);

    global.io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', correspondences);
  }
}

export default async function computeCorrespondencesAndCreate() {
  const accounts = await Account.findAll({});

  for (const account of accounts) {
    computeRemindersCorrespondencesAndCreate(account.id);
    computeRecallsCorrespondencesAndCreate(account.id);
    computeRemindersConfirmedCorrespondencesAndCreate(account.id);
  }
}

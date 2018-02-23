
import { namespaces } from '../../../config/globals';
import { SentReminder, Correspondence, Appointment } from '../../../_models';
import batchCreate from '../../../routes/util/batch';
import { reminderConfirmedNote, reminderSentNote } from '../../correspondences/appointmentNotesGenerators';
import { reminderSent, reminderConfirmed } from '../../correspondences/correspondenceNote';

/**
 * When a Reminder is sent out this runs to create correspondences and
 * update the appointment notes
 */
function sendReminderIdsSocket(sub, io) {
  sub.on('data', async (data) => {
    try {
      const sentReminderIds = JSON.parse(data);
      let sentReminders = await SentReminder.findAll({
        where: {
          isSent: true,
          id: sentReminderIds,
        },
      });

      const correspondencesCheck = await Correspondence.findAll({
        where: {
          sentReminderId: sentReminderIds,
        },
      });

      const sentReminderIdsCheck = correspondencesCheck.map(s => s.sentReminderId);

      sentReminders = sentReminders.filter((s) => {
        return !sentReminderIdsCheck.includes(s.id);
      });

      // create an object of correspondences from sent reminders
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

      let correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');

      if (correspondences[0]) {
        const accountId = correspondences[0].accountId;
        correspondences = correspondences.map(c => c.id);

        console.log(`Sending ${correspondences.length} ${Correspondence.REMINDER_SENT_TYPE} correspondences for account=${accountId}`);

        return io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', correspondences);
      }
    } catch (error) {
      let {
        errors,
        docs,
      } = error;

      if (errors && docs && docs.length) {
        docs = docs.map(d => d.get({ plain: true }));

        if (docs[0]) {
          const accountId = docs[0].accountId;

          console.log(`Sending ${docs.length} correspondences for account=${accountId}`);

          io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', docs);
        }
        // Log any errors that occurred
        errors.forEach((err) => {
          console.error(err);
        });
      } else {
        console.error(error);
      }
    }
  });
}

/**
 * When a Reminder is confirmed this runs to create correspondences and
 * update the appointment notes
 */
function sendReminderUpdatedSocket(sub, io) {
  sub.on('data', async (data) => {
    try {
      const sentReminder = await SentReminder.findById(data);
      const correspondence = await Correspondence.findOne({
        where: {
          sentReminderId: data,
          type: Correspondence.REMINDER_SENT_TYPE,
        },
        raw: true,
      });

      const correspondenceCheck = await Correspondence.findOne({
        where: {
          sentReminderId: data,
          type: Correspondence.REMINDER_CONFIRMED_TYPE,
        },
        raw: true,
      });

      if (!correspondenceCheck) {
        correspondence.note = reminderConfirmed(sentReminder);
        correspondence.type = Correspondence.REMINDER_CONFIRMED_TYPE;
        correspondence.isSyncedWithPms = false;
        correspondence.contactedAt = new Date();
        correspondence.id = undefined;
        correspondence.pmsId = undefined;

        const newCorrespondence = await Correspondence.create(correspondence);

        console.log(`Sending patient confirmed correspondence for account=${correspondence.accountId}`);

        io.of(namespaces.sync).in(correspondence.accountId).emit('CREATE:Correspondence', [newCorrespondence.id]);
      }
    } catch (error) {
      console.error(error);
    }
  });
}


export default function registerRemindersSubscriber(context, io) {
  // Need to create a new sub for every route to tell
  // the difference eg. request.created and request.ended
  const subCreated = context.socket('SUB', { routing: 'topic' });
  const subUpdated = context.socket('SUB', { routing: 'topic' });

  subCreated.setEncoding('utf8');
  subCreated.connect('events', 'REMINDER:SENT:BATCH');

  subUpdated.setEncoding('utf8');
  subUpdated.connect('events', 'REMINDER:UPDATED');

  sendReminderIdsSocket(subCreated, io);
  sendReminderUpdatedSocket(subUpdated, io);
}

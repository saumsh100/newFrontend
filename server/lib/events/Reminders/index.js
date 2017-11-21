import { namespaces } from '../../../config/globals';
import { SentReminder, Correspondence } from '../../../_models';
import batchCreate from '../../../routes/util/batch';


function sendReminderIdsSocket(sub, io) {
  sub.on('data', async (data) => {
    try {
      const sentReminderIds = JSON.parse(data);
      let sentReminders = await SentReminder.findAll({
        where: {
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

      const correspondencesToCreate = sentReminders.map((sr) => {
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

      let correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');

      if (correspondences[0]) {
        const accountId = correspondences[0].accountId;
        correspondences = correspondences.map(c => c.id);

        console.log(`Sending ${correspondences.length} correspondences for account=${accountId}`);

        return io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', correspondences);
      }
    } catch (error) {
      let {
        errors,
        docs,
      } = error;

      if (errors && docs && docs.length) {
        docs = docs.map(d => d.get({ plain: true }));

        docs = docs.map(c => c.id);

        if (docs[0]) {
          const accountId = docs[0].accountId;
          docs = docs.map(c => c.id);

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

function sendReminderUpdatedSocket(sub, io) {
  sub.on('data', async (data) => {
    try {
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
        correspondence.note = Correspondence.REMINDER_CONFIRMED_NOTE;
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


import {
  Correspondence,
  Reminder,
  SentReminder,
  SentRemindersPatients,
  Patient,
} from 'CareCruModels';
import { namespaces } from '../../../config/globals';
import batchCreate from '../../../routes/util/batch';
import { reminderSent, reminderConfirmed } from '../../correspondences/correspondenceNote';

/**
 * When a Reminder is sent out this runs to create correspondences and
 * update the appointment notes
 */
function sendReminderIdsSocket(sub, io) {
  sub.on('data', async (data) => {
    try {
      const sentReminderIds = JSON.parse(data);
      const sentReminders = await SentReminder.findAll({
        where: {
          isSent: true,
          id: sentReminderIds,
        },
        include: [
          {
            model: Reminder,
            as: 'reminder',
          },
          {
            model: Patient,
            as: 'patient',
          },
          {
            model: SentRemindersPatients,
            as: 'sentRemindersPatients',
            required: true,
            include: [
              {
                model: Patient,
                as: 'patient',
              },
            ],
          },
        ],
      });

      if (sentReminders.length === 0) {
        return;
      }

      const accountId = sentReminders[0].get('accountId');
      const correspondencesCheck =
        await Correspondence.findAll({ where: { sentReminderId: sentReminderIds } });

      const sentReminderIdsCheck = correspondencesCheck.map(s => s.sentReminderId);

      // create an object of correspondences from sent reminders
      const correspondencesToCreate = sentReminders
        .filter(s => !sentReminderIdsCheck.includes(s.id))
        .reduce((toCreate, sr) => [
          ...toCreate,
          ...sr.sentRemindersPatients.map(srp => ({
            accountId: sr.accountId,
            patientId: srp.patientId,
            sentReminderId: sr.id,
            appointmentId: srp.appointmentId,
            method: sr.primaryType,
            type: Correspondence.REMINDER_SENT_TYPE,
            contactedAt: sr.createdAt,
            note: reminderSent(sr, srp.patient),
          })),
        ], []);
                
      const correspondences =
        (await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence')).map(c => c.id);
     
      if (correspondences.length > 0) {
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

        if (docs.length > 0) {
          const { accountId } = docs[0];

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
      const sentReminder = await SentReminder.findOne({
        where: { id: data },
        include: [
          {
            model: Reminder,
            as: 'reminder',
          },
          {
            model: Patient,
            as: 'patient',
          },
          {
            model: SentRemindersPatients,
            as: 'sentRemindersPatients',
            required: true,
            include: [
              {
                model: Patient,
                as: 'patient',
              },
            ],
          },
        ],
      });

      const correspondences = await Correspondence.findAll({
        where: {
          sentReminderId: data,
          type: Correspondence.REMINDER_SENT_TYPE,
        },
        raw: true,
      });

      const accountId = sentReminder.get('accountId');
      const correspondencesToUpdate = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const correspondence of correspondences) {
        const correspondenceCheck = await Correspondence.findOne({
          where: {
            sentReminderId: data,
            patientId: correspondence.patientId,
            patientId: correspondence.appointmentId,
            type: Correspondence.REMINDER_CONFIRMED_TYPE,
          },
          raw: true,
        });

        if (!correspondenceCheck) {
          const { patient } =
            sentReminder.sentRemindersPatients.find(v => v.patientId === correspondence.patientId);
          const newCorrespondence = await Correspondence.create({
            ...correspondence,
            note: reminderConfirmed(sentReminder, patient),
            type: Correspondence.REMINDER_CONFIRMED_TYPE,
            isSyncedWithPms: false,
            contactedAt: new Date(),
            id: undefined,
            pmsId: undefined,
          });
          correspondencesToUpdate.push(newCorrespondence.id);
        }
      }

      console.log(`Sending ${correspondences.length} ${Correspondence.REMINDER_CONFIRMED_TYPE} correspondence for account=${accountId}`);
      io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', correspondencesToUpdate);
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

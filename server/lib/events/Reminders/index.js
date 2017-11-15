import { namespaces } from '../../../config/globals';
import { SentReminder, Correspondence } from '../../../_models';
import batchCreate from '../../../routes/util/batch';


function sendReminderIdsSocket(sub, io) {
  sub.on('data', async (data) => {
    try {
      const sentreminderIds = JSON.parse(data);
      const sentreminders = await SentReminder.findAll({
        where: {
          id: sentreminderIds,
        },
      });

      const correspondencesToCreate = sentreminders.map((sr) => {
        return {
          accountId: sr.accountId,
          patientId: sr.patientId,
          appointmentId: sr.appointmentId,
          type: sr.primaryType,
        };
      });


      let correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');

      if (correspondences[0]) {
        const accountId = correspondences[0].accountId;
        correspondences = correspondences.map(c => c.id);

        return io.of(namespaces.dash).in(accountId).emit('CREATE:Correspondence', correspondences);
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

          io.of(namespaces.dash).in(accountId).emit('CREATE:Correspondence', docs);
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


export default function registerRemindersSubscriber(context, io) {
  // Need to create a new sub for every route to tell
  // the difference eg. request.created and request.ended
  const subCreated = context.socket('SUB', { routing: 'topic' });

  subCreated.setEncoding('utf8');
  subCreated.connect('events', 'REMINDER:SENT:BATCH');

  sendReminderIdsSocket(subCreated, io);
}

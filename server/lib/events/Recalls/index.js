import { namespaces } from '../../../config/globals';
import { SentRecall, Correspondence } from '../../../_models';
import batchCreate from '../../../routes/util/batch';

/**
 * Create correspondences from 'data', which contains ids of recalls sent.
 * Send ids of these created correspondences to the SocketIO sync namespace.
 * @param {*} recallSentSocket socket to AMQP service
 * @param {*} io initialized SocketIO object
 */
function recallSentHandler(recallSentSocket, io) {
  let correspondences = [];

  recallSentSocket.on('data', async (data) => {
    try {
      let recallsSent = await SentRecall.findAll({
        where: {
          id: JSON.parse(data),
        },
        raw: true,
      });


      const correspondencesCheck = await Correspondence.findAll({
        where: {
          sentRecallId: JSON.parse(data),
        },
      });

      const sentRecallIdsCheck = correspondencesCheck.map(s => s.sentRecallId);

      recallsSent = recallsSent.filter((s) => {
        return !sentRecallIdsCheck.includes(s.id);
      });

      const correspondencesToCreate = convertRecallsToCorrespondences(recallsSent);

      correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');
    } catch (error) {
      const { errors, docs } = error;

      if (errors && docs && docs.length) {
        if (docs && docs.length) {
          correspondences = docs.map(d => d.get({ plain: true }));
        }

        errors.forEach((err) => {
          console.error(err);
        });
      } else {
        console.error(error);
      }
    }

    if (correspondences[0]) {
      const accountId = correspondences[0].accountId;
      const correspondenceIds = correspondences.map(correspondence => correspondence.id);

      console.log(`Sending ${correspondenceIds.length} correspondences for account=${accountId}`);

      io.of(namespaces.sync)
       .in(accountId)
       .emit('CREATE:Correspondence', correspondenceIds);
    }
  });
}

/**
 * Generates correspondences to be created in the db.
 * Correspondence type has nothing to do with the Recall type. Correspondence type
 * is what caused the correspondence to create. E.g. "RECALL:SENT".
 * @param {*} recallsSent
 * @return array of Correspondences to be created in the db
 */
function convertRecallsToCorrespondences(recallsSent) {
  return recallsSent.map(recall => Object.assign(
    {},
    {
      accountId: recall.accountId,
      patientId: recall.patientId,
      sentRecallId: recall.id,
      type: Correspondence.RECALL_SENT_TYPE,
      method: recall.primaryType,
      contactedAt: recall.createdAt,
      note: 'Sent Recall VIA CareCru',
    }));
}

/**
 * Subscribes to 'RECALL:SENT:BATCH' with AMQP service and registeres the handler
 * to respond to events.
 * @param {*} context initialized AMQP context
 * @param {*} io initialized SocketIO object
 */
export default function registerRecallsSubscriber(context, io) {
  const recallSentSubscribeSocket = context.socket('SUB', { routing: 'topic' });

  recallSentSubscribeSocket.setEncoding('utf8');
  recallSentSubscribeSocket.connect('events', 'RECALL:SENT:BATCH');

  recallSentHandler(recallSentSubscribeSocket, io);
}

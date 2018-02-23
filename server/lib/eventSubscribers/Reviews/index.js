
import { namespaces } from '../../../config/globals';
import { SentReview, Review, Correspondence, Appointment } from '../../../_models';
import { reviewCompleted, reviewSent } from '../../correspondences/correspondenceNote';
import batchCreate from '../../../routes/util/batch';

/**
 * When a Review is sent out this runs to create correspondences
 */
function sendReviewIdsSocket(sub, io) {
  sub.on('data', async (data) => {
    try {
      const sentReviewIds = JSON.parse(data);
      let sentReviews = await SentReview.findAll({
        where: {
          isSent: true,
          id: sentReviewIds,
        },
      });

      const correspondencesCheck = await Correspondence.findAll({
        where: {
          sentReviewId: sentReviewIds,
        },
      });

      const sentReviewIdsCheck = correspondencesCheck.map(s => s.sentReviewId);

      sentReviews = sentReviews.filter((s) => {
        return !sentReviewIdsCheck.includes(s.id);
      });

      // create an object of correspondences from sent reminders
      const correspondencesToCreate = sentReviews.map((sr) => {
        return {
          accountId: sr.accountId,
          patientId: sr.patientId,
          sentReviewId: sr.id,
          appointmentId: sr.appointmentId,
          method: sr.primaryType,
          type: Correspondence.REVIEW_SENT_TYPE,
          contactedAt: sr.createdAt,
          note: reviewSent(sr),
        };
      });

      let correspondences = await batchCreate(correspondencesToCreate, Correspondence, 'Correspondence');
      if (correspondences[0]) {
        const accountId = correspondences[0].accountId;
        correspondences = correspondences.map(c => c.id);
        console.log(`Sending ${correspondences.length} ${Correspondence.REVIEW_SENT_TYPE} correspondences for account=${accountId}`);
        return io && io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', correspondences);
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
          io && io.of(namespaces.sync).in(accountId).emit('CREATE:Correspondence', docs);
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
 * When a Review is completed this runs to create correspondences
 */
function sendReviewCompletedSocket(sub, io) {
  sub.on('data', async (data) => {
    try {
      const sentReviewId = data;
      const correspondenceCheck = await Correspondence.findOne({
        raw: true,
        where: {
          sentReviewId,
          type: Correspondence.REVIEW_COMPLETED_TYPE,
        },
      });

      // If it already exists don't do it again!
      if (correspondenceCheck) return;

      const sentReview = await SentReview.findOne({
        where: { id: sentReviewId },
        include: [{
          model: Review,
          as: 'review',
          required: true,
        }]
      });

      const newCorrespondence = await Correspondence.create({
        accountId: sentReview.accountId,
        patientId: sentReview.patientId,
        sentReviewId: sentReview.id,
        appointmentId: sentReview.appointmentId,
        method: sentReview.primaryType,
        type: Correspondence.REVIEW_COMPLETED_TYPE,
        contactedAt: sentReview.review.createdAt,
        note: reviewCompleted(sentReview),
      });

      console.log(`Sending ${Correspondence.REVIEW_COMPLETED_TYPE} correspondence for account=${sentReview.accountId}`);
      io && io.of(namespaces.sync).in(sentReview.accountId).emit('CREATE:Correspondence', [newCorrespondence.id]);
    } catch (error) {
      console.error(error);
    }
  });
}


export default function registerReviewsSubscriber(context, io) {
  // Need to create a new sub for every route to tell
  // the difference eg. request.created and request.ended
  const subCreated = context.socket('SUB', { routing: 'topic' });
  const subUpdated = context.socket('SUB', { routing: 'topic' });

  subCreated.setEncoding('utf8');
  subCreated.connect('events', 'REVIEW:SENT:BATCH');

  subUpdated.setEncoding('utf8');
  subUpdated.connect('events', 'REVIEW:COMPLETED');

  sendReviewIdsSocket(subCreated, io);
  sendReviewCompletedSocket(subUpdated, io);
}

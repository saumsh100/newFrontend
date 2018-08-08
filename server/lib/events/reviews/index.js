import { SentReview, Review, Appointment } from '../../../_models';

export async function fetchReviewEvents({ patientId, accountId, query }) {
  return SentReview.findAll({
    raw: true,
    nest: true,
    where: {
      patientId,
      accountId,
      isSent: true,
    },
    include: [
      {
        model: Review,
        as: 'review',
        where: {
          accountId,
          patientId,
        },
      },
      {
        model: Appointment,
        as: 'appointment',
        where: {
          patientId,
          accountId,
          isDeleted: false,
          isCancelled: false,
          isMissed: false,
          isPending: false,
        },
      },
    ],
    attributes: [
      'id',
      'createdAt',
      'isCompleted',
      'review.stars',
      'review.description',
      'appointment.startDate',
    ],
    order: [['createdAt', 'DESC']],
    ...query,
  });
}

export function buildReviewEvent({ patient, data }) {
  return {
    id: Buffer.from(`review-${data.id}`).toString('base64'),
    type: 'Review',
    metaData: {
      ...data,
      firstName: patient.firstName,
    },
  };
}
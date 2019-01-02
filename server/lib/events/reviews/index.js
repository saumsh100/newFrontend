
import groupBy from 'lodash/groupBy';
import { SentReview, Review, Appointment } from '../../../_models';
import Appointments from '../../../../client/entities/models/Appointments';

export async function fetchReviewEvents({ patientId, accountId, query }) {
  const reviews = await SentReview.findAll({
    raw: true,
    nest: true,
    where: {
      patientId,
      accountId,
    },
    include: [
      {
        model: Review,
        as: 'review',
        where: {
          accountId,
          patientId,
        },
        required: false,
        attributes: ['stars', 'description'],
      },
      {
        model: Appointment,
        as: 'appointment',
        where: {
          patientId,
          accountId,
          ...Appointments.getCommonSearchAppointmentSchema(),
        },
        attributes: ['id', 'startDate'],
      },
    ],
    attributes: [
      'id',
      'createdAt',
      'isCompleted',
      'review.stars',
      'review.description',
      'appointment.startDate',
      'primaryType',
    ],
    order: [['createdAt', 'DESC']],
    ...query,
  });
  return reviews.length > 0 ? groupReviewEvents(reviews) : [];
}

export function buildReviewEvent({ patient, data }) {
  return {
    id: Buffer.from(`review-${data.id}`).toString('base64'),
    type: 'review',
    metaData: {
      ...data,
      firstName: patient.firstName,
    },
  };
}


/**
 * Groups Reviews sent for the same appointment
 * @param {*} reviews
 */
function groupReviewEvents(reviews) {
  if (reviews.length === 1) return reviews;

  return Object.values(groupBy(reviews, 'appointment.id'))
    .map((review) => {
      if (review.length === 1) {
        return {
          ...review,
          grouped: false,
        };
      }
      return {
        ...(review.find(r => r.isCompleted) || review),
        grouped: true,
      };
    });
}

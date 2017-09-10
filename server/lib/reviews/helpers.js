
import moment from 'moment';
import { Appointment, Patient, SentReview, Review } from '../../_models';

// Made an effort to throw all easily testable functions into here

/**
 * getAppointmentsFromReminder returns all of the appointments that are
 * - in that clinic
 * - within the reminder timeAway range
 * - and if we should send reminder
 *
 * @param reminder
 * @param date
 */
export async function getReviewAppointments({ account, date }) {
  const begin = moment(date).subtract(1, 'week').toISOString();
  const appointments = await Appointment.findAll({
    where: {
      isDeleted: false,
      accountId: account.id,
      startDate: {
        $between: [begin, date],
      },
    },

    include: [
      {
        model: Patient,
        as: 'patient',
        required: true,
        include: [
          {
            model: Review,
            as: 'reviews',
            required: false,
          },
        ],
      },
      {
        model: SentReview,
        as: 'sentReviews',
        required: false,
      },
    ],
  });

  // Filter down to appointments who have no sentReviews and
  // whose patients have not yet reviewed the clinic
  const filteredAppointments = appointments.filter((a) => {
    const reviewNotSent = !a.sentReviews.length;
    const patientNotReviewed = !a.patient.reviews.length;
    return reviewNotSent && patientNotReviewed;
  });

  return filteredAppointments;
}

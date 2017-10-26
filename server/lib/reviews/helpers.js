
import moment from 'moment';
import uniqBy from 'lodash/uniqBy';
import {
  Appointment,
  Patient,
  SentReview,
  Review,
  Practitioner,
} from '../../_models';
import { generateOrganizedPatients } from '../comms/util';

/**
 * getPatientsNeedingReview
 */
export async function getReviewPatients({ account, date }) {
  const appointments = await exports.getReviewAppointments({ account, date });
  const patients = appointments.map((appt) => {
    const patient = appt.patient.get({ plain: true });
    patient.appointment = appt.get({ plain: true });
    return patient;
  });

  return generateOrganizedPatients(patients, 'email');
}

/**
 * getReviewAppointments
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

    // Do this so that uniqWith will remove last patient
    order: [['startDate', 'DESC']],

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
          {
            model: SentReview,
            as: 'sentReviews',
            required: false,
          },
        ],
      },
      {
        model: SentReview,
        as: 'sentReviews',
        required: false,
      },

      // Need this for the practitioner avatar
      {
        model: Practitioner,
        as: 'practitioner',
        required: true,
      },
    ],
  });

  // console.log(appointments);

  // Filter down to appointments who have no sentReviews and
  // whose patients have not yet reviewed the clinic
  const sendableAppointments = appointments.filter((a) => {
    const reviewNotSent = !a.sentReviews.length;
    const patientNotReviewed = !a.patient.reviews.length;
    // console.log('patient.sentReviews', a.patient.sentReviews);
    const patientHasNoRecentSentReview = !a.patient.sentReviews.some(sr => moment(sr.createdAt).isBetween(begin, date));
    return reviewNotSent && patientNotReviewed && patientHasNoRecentSentReview;
  });

  // Do not send to the same patient twice
  const filteredAppointments = uniqBy(sendableAppointments, 'patientId');

  return filteredAppointments;
}

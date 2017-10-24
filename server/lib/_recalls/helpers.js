
import moment from 'moment';
import { Appointment, Patient, SentRecall } from '../../_models';

/**
 * getAppointmentsFromReminder returns all of the appointments that are
 * - in that clinic
 * - within the reminder timeAway range
 * - and if we should send reminder
 *
 * @param reminder
 * @param date
 */
export async function getPatientsDueForRecall({ recall, account, date }) {
  const pastDate = moment(date).subtract(2, 'years').toISOString();
  const patients = await Patient.findAll({
    where: {
      isDeleted: false,
      accountId: account.id,
      status: 'Active',
    },

    include: [
      {
        where: {
          isDeleted: false,
          isCancelled: false,
          startDate: {
            gt: pastDate,
          }
        },

        model: Appointment,
        as: 'appointments',
        order: [['startDate', 'DESC']],
        required: true,
      },
      {
        model: SentRecall,
        as: 'sentRecalls',
      },
    ],
  });

  return patients.filter(patient => isDueForRecall({ recall, patient: patient.get({ plain: true }), date }));
}

/**
 * shouldSendReminder returns a boolean if the appointment is in need
 * of a reminder being sent
 * - checks if reminder was already sent
 * - and if it is sendable according to patient preferences
 *
 * @param recall
 * @param patient
 * @param date
 * @returns {boolean}
 */
export function isDueForRecall({ recall, patient, date }) {
  const { appointments, sentRecalls } = patient;

  const numAppointments = appointments.length;
  if (!numAppointments) return false;

  // Check if latest appointment is within the recall window
  const { startDate } = appointments[appointments.length - 1];
  const isDue = moment(date).diff(startDate) / 1000 > recall.lengthSeconds;

  const recallAlreadySentOrLongerAway = sentRecalls.some((s) => {
    return (s.recallId === recall.id) || (recall.lengthSeconds > s.lengthSeconds);
  });

  return isDue && !recallAlreadySentOrLongerAway;
}

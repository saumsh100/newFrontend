
import moment from 'moment';
import { r } from '../../config/thinky';
import { Appointment, Patient } from '../../models';

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
export async function getPatientsDueForRecall({ recall, account, date }) {
  const filterObject = {
    accountId: account.id,
    // TODO: save the recall filtering until it computes recall
    // This is because we want to be able to show the users which patients
    // are due for recall even tho the communication was not sent
    // preferences: { recalls: true },
  };


  const joinObject = {
    sentRecalls: true,
    appointments: {
      _apply(sequence) {
        // TODO: This will order oldest appointment first, needs to be flipped!
        return sequence
          .filter({
            isDeleted: false,
            isCancelled: false,
          })
          .orderBy('startDate');
      },
    },
  };

  const patients = await Patient.filter(filterObject).getJoin(joinObject).run();
  return patients.filter(patient => isDueForRecall({ recall, patient, date }));
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
  const isDue = moment(date).diff(startDate) > recall.lengthSeconds;

  const recallAlreadySentOrLongerAway = sentRecalls.some((s) => {
    return (s.recallId === recall.id) || (recall.lengthSeconds > s.lengthSeconds);
  });

  return isDue && !recallAlreadySentOrLongerAway;
}

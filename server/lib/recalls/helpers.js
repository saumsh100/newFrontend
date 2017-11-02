
import moment from 'moment';
import {
  Appointment,
  Patient,
  SentRecall,
} from '../../_models';
import { generateOrganizedPatients } from '../comms/util';

/**
 * mapPatientsToRecalls is a function that takes the clinic's recalls
 * and produces an array that matches the order of the success and fail patients for each recall
 * - success and fail is really just determined off of whether the patient has a property that the
 * primaryType of comms is dependant on, we do this so that we can batchSave fails
 * - fails = (sentRecalls where isSent=false with an errorCode)
 *
 * @param recalls
 * @returns {Promise.<Array>}
 */
export async function mapPatientsToRecalls({ recalls, account, date }) {
  const seen = {};
  const recallsPatients = [];
  for (const recall of recalls) {
    // Get patients whose last appointment is associated with this recall
    const patients = await exports.getPatientsDueForRecall({ recall, account, date });

    // If it has been seen by an earlier recall (farther away from due date), ignore it!
    // This is why the order or recalls is so important
    const unseenPatients = patients.filter(p => !seen[p.id]);

    // Now add it to the seen map
    unseenPatients.forEach(p => seen[p.id] = true);

    // .push({ success, errors })
    recallsPatients.push(generateOrganizedPatients(unseenPatients, recall.primaryType));
  }

  return recallsPatients;
}

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
  // TODO: we need to get this to work with new recalls format where there are multiple
  const pastDate = moment(date).subtract(2, 'years').toISOString();
  const patients = await Patient.findAll({
    where: {
      isDeleted: false,
      accountId: account.id,
      status: 'Active',
    },

    order: [[{ model: Appointment, as: 'appointments' }, 'startDate', 'asc']],

    include: [
      {
        where: {
          isDeleted: false,
          isCancelled: false,
          isShortCancelled: false,
          isPending: false,
          startDate: {
            gt: pastDate,
          }
        },

        model: Appointment,
        as: 'appointments',
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
  const { appointments, sentRecalls, preferences } = patient;

  // If they've never had any appointments, don't bother
  const numAppointments = appointments.length;
  if (!numAppointments) return false;

  // Check if latest appointment is within the recall window
  // TODO: should probably add date check to query to reduce size of query
  const { startDate } = appointments[appointments.length - 1];
  const isDue = moment(date).diff(startDate) / 1000 > recall.lengthSeconds;

  const recallAlreadySentOrLongerAway = sentRecalls.some((s) => {
    return (s.recallId === recall.id) || (recall.lengthSeconds > s.lengthSeconds);
  });

  return isDue && !recallAlreadySentOrLongerAway && preferences.reminders;
}

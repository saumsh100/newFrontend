
import moment from 'moment';
import {
  Appointment,
  Patient,
  SentRecall,
} from '../../_models';
import { generateOrganizedPatients } from '../comms/util';

// 1 day
const DEFAULT_RECALL_BUFFER = 86400;

/**
 * mapPatientsToRecalls is a function that takes the clinic's recalls
 * and produces an array that matches the order of the success and fail patients for each recall
 * - success and fail is really just determined off of whether the patient has a property that the
 * primaryType of comms is dependant on, we do this so that we can batchSave fails
 * - fails = (sentRecalls where isSent=false with an errorCode)
 *
 * @param recalls
 * @param account
 * @param date
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
 * @param account
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

  return patients.filter(patient => isDueForRecall({ account, recall, patient: patient.get({ plain: true }), date }));
}

/**
 * shouldSendReminder returns a boolean if the appointment is in need
 * of a reminder being sent
 * - checks if reminder was already sent
 * - and if it is sendable according to patient preferences
 *
 * @param account
 * @param recall
 * @param patient
 * @param date
 * @returns {boolean}
 */
export function isDueForRecall({ account, recall, patient, date }) {
  const { appointments, sentRecalls, preferences } = patient;

  // If they've never had any appointments, don't bother
  const numAppointments = appointments.length;
  if (!numAppointments) return false;

  // Check if latest appointment is within the recall window
  // TODO: should probably add date check to query to reduce size of query
  const { startDate } = appointments[appointments.length - 1];

  // Get the preferred due date
  const dueDateSeconds = patient.recallDueDateSeconds || account.recallDueDateSeconds;

  console.log(dueDateSeconds, recall.lengthSeconds);

  // Recalls work around dueDate, whereas Reminders work around appointment.startDate
  const recallSeconds = dueDateSeconds - recall.lengthSeconds;

  // Get how long ago last appointment was
  const appointmentTimeAwaySeconds = moment(date).diff(startDate) / 1000;

  console.log(recallSeconds, appointmentTimeAwaySeconds, (recallSeconds + DEFAULT_RECALL_BUFFER));

  // Determine if the dueDate from  last appointment fits into this recall (with a buffer)
  const isDue = (recallSeconds <= appointmentTimeAwaySeconds) &&
    (appointmentTimeAwaySeconds <= (recallSeconds + DEFAULT_RECALL_BUFFER));

  console.log('isDue', isDue);

  // If I sent a 2week PAST dueDate, don't send a 1week PAST dueDate, stick to recalls
  // further down the line
  const recallAlreadySentOrLongerAway = sentRecalls.some((sentRecall) => {
    return recall.lengthSeconds >= sentRecall.lengthSeconds;
  });

  return isDue && !recallAlreadySentOrLongerAway && preferences.reminders;
}



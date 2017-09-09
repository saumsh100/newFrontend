
import moment from 'moment';
import { Appointment, Patient, SentReminder } from '../../_models';

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
export async function getReviewAppointments(account, date) {
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
      },
      /*{
        model: SentReminder,
        as: 'sentReminders',
        required: false,
      },*/
    ],
  });

  return appointments;
}

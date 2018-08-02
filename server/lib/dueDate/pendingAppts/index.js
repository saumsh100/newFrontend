
import {
  Appointment,
  AppointmentCode,
  Patient,
  Account,
} from '../../../_models';
import { recallCodes } from '../../lastRecall';

/**
 * finds the next most recent  Appointment of
 * code from the now date with the patient model
 *
 * @param  {[query]} object - query of patient
 * @param  {[object]} code - sequelize filter on code
 * @return {[array]} - an array of patients with appointments
 */
function getPatientsWithAppointmentBasedOnCode(query, code) {
  return Patient.findAll({
    where: query,
    order: [
      [{ model: Appointment, as: 'appointments' }, 'startDate', 'ASC'],
    ],
    include: [{
      model: Appointment,
      as: 'appointments',
      where: {
        isCancelled: false,
        isPending: true,
      },
      include: [{
        model: AppointmentCode,
        as: 'appointmentCodes',
        where: {
          code,
        },
        required: true,
      }],
      required: true,
    }],
  });
}

/**
 * checks to see if the patientIds have a lastHygieneDate or
 * lastRecallDate. If they do their due dates are null, if they don't search for their next recall
 * date in the future
 *
 * @param  {[uuid]} accountId - uuid of accountId
 * @param  {[array]} patientIds - array of patientIds if not sent then assume all patients
 */
export async function updatePatientDueDate(accountId, patientIds) {
  const idQuery = patientIds || { $not: null };

  await Patient.update({
    dueForHygieneDate: null,
    dueForRecallExamDate: null,
    recallPendingAppointmentId: null,
    hygienePendingAppointmentId: null,
  }, {
    where: { id: idQuery, accountId },
  });

  const patientsHygiene = await getPatientsWithAppointmentBasedOnCode({
    id: idQuery,
    accountId,
    lastHygieneDate: {
      $not: null,
    },
  }, { $like: '111%' });

  const patientsRecall = await getPatientsWithAppointmentBasedOnCode({
    id: idQuery,
    accountId,
    lastRecallDate: {
      $not: null,
    },
  }, recallCodes);

  // for the patients with lastHygieneDate null find their due date for hygiene
  for (let i = 0; i < patientsHygiene.length; i += 1) {
    await patientsHygiene[i].update({
      dueForHygieneDate: patientsHygiene[i].appointments[0].originalDate,
      hygienePendingAppointmentId: patientsHygiene[i].appointments[0].id,
    });
  }

  for (let i = 0; i < patientsRecall.length; i += 1) {
    await patientsRecall[i].update({
      dueForRecallExamDate: patientsRecall[i].appointments[0].originalDate,
      recallPendingAppointmentId: patientsRecall[i].appointments[0].id,
    });
  }
}

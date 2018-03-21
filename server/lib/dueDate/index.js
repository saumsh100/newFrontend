import moment from 'moment';
import { uniq } from 'lodash';

import {
  Appointment,
  AppointmentCode,
  Patient,
  Account,
  sequelize,
} from '../../_models';
import { getAccountCronConfigurations, updateAccountCronConfigurations } from '../AccountCronConfigurations';
import { recallCodes } from '../lastRecall';

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
 * [getPatientsChangedAppointment finds the patients which could have
 * changed the one of due dates ]
 * @param  {[isoString]} date - an isoStringDate
 * @param  {[uuid]} accountId
 * @return {[array]} - array of patientIds
 */
export async function getPatientsChangedAppointment(date, accountId) {
  date = moment(date).toISOString();
  const patientsFromAppointments = await Appointment.findAll({
    raw: true,
    group: ['patientId'],
    paranoid: false,
    attributes: ['patientId'],
    where: {
      accountId,
      $or: {
        createdAt: {
          $gte: date,
        },
        updatedAt: {
          $gte: date,
        },
        deletedAt: {
          $gte: date,
        },
      },
    },
  });

  const patientIds = patientsFromAppointments.map(p => p.patientId);

  const patients = await Patient.findAll({
    raw: true,
    paranoid: false,
    attributes: ['id'],
    where: {
      accountId,
      $or: {
        createdAt: {
          $gte: date,
        },
        updatedAt: {
          $gte: date,
        },
        deletedAt: {
          $gte: date,
        },
        dueForHygieneDate: {
          $lte: date,
        },
        dueForRecallExamDate: {
          $lte: date,
        },
      },
    },
  });

  return uniq(patientIds.concat(patients.map(p => p.id)));
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
  const t = await sequelize.transaction();

  try {
    await Patient.update({
      dueForHygieneDate: null,
      dueForRecallExamDate: null,
      recallPendingAppointmentId: null,
      hygienePendingAppointmentId: null,
    }, {
      where: { id: idQuery, accountId },
    });
  } catch (e) {
    console.log(e);
    return null;
  }

  try {
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
      }, { transaction: t });
    }

    for (let i = 0; i < patientsRecall.length; i += 1) {
      await patientsRecall[i].update({
        dueForRecallExamDate: patientsRecall[i].appointments[0].originalDate,
        recallPendingAppointmentId: patientsRecall[i].appointments[0].id,
      }, { transaction: t });
    }

    await t.commit();
  } catch (e) {
    await t.rollback();
    console.log('DueDate job failed for Patients');
    return null;
  }

  console.log(`Updated the due date info for ${patientIds ? patientIds.length : 'all'} patients. accountId=${accountId}`);

  return null;
}

/**
* checks if the most recent hygiene has been run before for an account
* if it has only do it for patients who have hygiene procedures
*
* @param  {[uuid]} accountId
*/
export async function mostRecentDueDate(accountId) {
  const configs = await getAccountCronConfigurations(accountId);
  let date;
  for (let i = 0; i < configs.length; i += 1) {
    if (configs[i].name === 'CRON_DUE_DATE') {
      date = configs[i].value;
    }
  }
  // check if there's a date for the last cron for this account
  // if there is we find patients with newer invoices else
  // do the whole
  if (!date) {
    await updatePatientDueDate(accountId);
  } else {
    const patientIds = await getPatientsChangedAppointment(date, accountId);
    await updatePatientDueDate(accountId, patientIds);
  }

  await updateAccountCronConfigurations({
    name: 'CRON_DUE_DATE',
    value: moment().toISOString(),
  }, accountId);
}

/**
* Loops through all accounts and calculates
* the Due Date of Patients in each.
*/
export default async function mostRecentDueDateAllAccounts() {
  const accounts = await Account.findAll();

  for (let i = 0; i < accounts.length; i += 1) {
    console.log(`Updating the due date info for ${accounts[i].name}. accountId=${accounts[i].id}`);
    await mostRecentDueDate(accounts[i].id);
  }
}

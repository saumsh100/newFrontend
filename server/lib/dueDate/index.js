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
 * code from the now date
 *
 * @param  {[uuid]} patientId - a uuid of patient
 * @param  {[object]} code - sequelize filter on code
 * @param  {[isoString]} now
 * @return {[array]} - an array of appointments
 */
function getAppointmentWithPatientBasedOnCode(patientId, code, now) {
  return Appointment.findAll({
    where: {
      patientId,
      startDate: {
        $gt: now,
      },
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
    order: [
      ['startDate', 'ASC'],
    ],
    limit: 1,
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
  const idQuery = patientIds || { $ne: null };
  const t = await sequelize.transaction();

  const now = moment().toISOString();

  try {
    // check if lastHygieneDate is null
    const patients = await Patient.findAll({
      where: {
        id: idQuery,
      },
    });

    // for the patients with lastHygieneDate null find their due date for hygiene
    for (let i = 0; i < patients.length; i += 1) {
      const appointment
        = await getAppointmentWithPatientBasedOnCode(patients[i].id, { $like: '111%' }, now);

      // resetting the Patient's dueDates to null if no lastHygiene or no pending.
      if (!patients[i].lastHygieneDate || !appointment.length) {
        await patients[i].update({
          dueForHygieneDate: null,
        }, { transaction: t });
      } else if (appointment.length) {
        await patients[i].update({
          dueForHygieneDate: appointment[0].startDate,
        }, { transaction: t });
      }
    }

    // for the patients with lastRecallDate is null find their due date for hygiene
    for (let i = 0; i < patients.length; i += 1) {
      const appointment
        = await getAppointmentWithPatientBasedOnCode(patients[i].id, recallCodes, now);

      // resetting the Patient's dueDates to null if no lastHygiene or no pending.
      if (!patients[i].lastRecallDate || !appointment.length) {
        await patients[i].update({
          dueForRecallExamDate: null,
        }, { transaction: t });
      } else if (appointment.length) {
        await patients[i].update({
          dueForRecallExamDate: appointment[0].startDate,
        }, { transaction: t });
      }
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

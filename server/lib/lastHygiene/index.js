import moment from 'moment';
import { Account, Appointment, Patient, DeliveredProcedure, sequelize } from '../../_models';
import { getAccountCronConfigurations, updateAccountCronConfigurations } from '../AccountCronConfigurations';

/**
 * [getPatientsChangedDeliveredProcedure ]
 * @param  {[isoString]} date      an isoStringDate
 * @param  {[uuid]} accountId
 * @return {[array]}           [array of patientIds]
 */
export async function getPatientsChangedDeliveredProcedure(date, accountId) {
  date = moment(date).toISOString();
  const patients = await DeliveredProcedure.findAll({
    raw: true,
    group: ['patientId'],
    paranoid: false,
    attributes: [
      'patientId',
    ],
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

  return patients.map(p => p.patientId);
}

/**
 * [updateMostRecentHygiene gets most recent hygiene procedures for patients with them
 * and then trys to link to an appointment and update the patient model with
 * those values]
 * @param  {[uuid]} accountId  [description]
 * @param  {[array]} patientIds [description]
 */
export async function updateMostRecentHygiene(accountId, patientIds) {
  const patientId = patientIds || { $ne: null };

  // get all patients with procedure code starting with 111 and their most
  // recent one
  const invoices = await DeliveredProcedure.findAll({
    where: {
      accountId,
      procedureCode: {
        $like: '111%',
      },
      patientId,
    },
    attributes: [
      [sequelize.fn('MAX', sequelize.col('entryDate')), 'maxDate'],
      'patientId',
    ],
    group: ['patientId'],
    raw: true,
  });

  // try to link to an appointment and update the patient
  // if fails, just update the lastHygiene date
  // if pass, add lastHygieneApptId
  for (let i = 0; i < invoices.length; i += 1) {
    const invoice = invoices[i];
    const appointment = await Appointment.findAll({
      where: {
        startDate: {
          $gte: moment(invoice.maxDate).subtract(16, 'hours').toISOString(),
          $lte: moment(invoice.maxDate).add(16, 'hours').toISOString(),
        },
        patientId: invoice.patientId,
      },
      limit: 1,
      raw: true,
    });

    const lastHygieneApptId = appointment[0] ? appointment[0].id : null;
    await Patient.update({
      lastHygieneApptId,
      lastHygieneDate: moment(invoice.maxDate).toISOString(),
    }, { where: { id: invoice.patientId } });
  }

  console.log(`Updated the last hygiene info for ${invoices.length} patients. accountId=${accountId}`);

  return null;
}

/**
 * checks if the most recent hygiene has been run before for an account
 * if it has only do it for patients who have hygiene procedures
 * created, updated, or deleted recently
 * @param  {[uuid]} accountId
 */
export async function mostRecentHygiene(accountId) {
  const configs = await getAccountCronConfigurations(accountId);
  let date;
  for (let i = 0; i < configs.length; i += 1) {
    if (configs[i].name === 'CRON_LAST_HYGIENE') {
      date = configs[i].value;
    }
  }
  // check if there's a date for the last cron for this account
  // if there is we find patients with newer invoices else
  // do the whole
  if (!date) {
    await updateMostRecentHygiene(accountId);
  } else {
    const patientIds = await getPatientsChangedDeliveredProcedure(date, accountId);
    await updateMostRecentHygiene(accountId, patientIds);
  }

  await updateAccountCronConfigurations({
    name: 'CRON_LAST_HYGIENE',
    value: moment().toISOString(),
  }, accountId);
}

export default async function mostRecentHygieneAllAccounts() {
  const accounts = await Account.findAll();

  for (let i = 0; i < accounts.length; i += 1) {
    console.log(`Updating the last hygiene info for ${accounts[i].name}. accountId=${accounts[i].id}`);
    await mostRecentHygiene(accounts[i].id);
  }
}

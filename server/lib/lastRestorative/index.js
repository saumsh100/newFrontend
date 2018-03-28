import moment from 'moment';
import { Account, Appointment, Patient, DeliveredProcedure, sequelize } from '../../_models';
import { getAccountCronConfigurations, updateAccountCronConfigurations } from '../AccountCronConfigurations';

const restorativeCodes = [
  '20111',
  '20119',
  '20141',
  '21111',
  '21112',
  '21113',
  '21114',
  '21115',
  '21121',
  '21122',
  '21123',
  '21124',
  '21125',
  '21211',
  '21212',
  '21213',
  '21214',
  '21215',
  '21221',
  '21222',
  '21223',
  '21224',
  '21225',
  '21231',
  '21232',
  '21233',
  '21234',
  '21235',
  '21241',
  '21242',
  '21243',
  '21244',
  '21245',
  '21401',
  '21402',
  '21403',
  '21404',
  '22201',
  '22211',
  '22301',
  '22311',
  '22401',
  '22501',
];

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
 * [updateMostRecentRestorative gets most restorative procedures for patients with them
 * and then trys to link to an appointment and update the patient model with
 * those values]
 * @param  {[uuid]} accountId  [description]
 * @param  {[array]} patientIds [description]
 */
export async function updateMostRecentRestorative(accountId, patientIds) {
  const patientId = patientIds || { $ne: null };

  await Patient.update({
    lastRestorativeDate: null,
    lastRestorativeApptId: null,
  }, {
    where: { id: patientId, accountId },
  });

  // get all patients with procedure code of reminder exams
  // recent one
  const invoices = await DeliveredProcedure.findAll({
    where: {
      accountId,
      isCompleted: true,
      procedureCode: restorativeCodes,
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
  // if pass, add lastRestorativeApptId
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

    const lastRestorativeApptId = appointment[0] ? appointment[0].id : null;
    await Patient.update({
      lastRestorativeApptId,
      lastRestorativeDate: moment(invoice.maxDate).toISOString(),
    }, { where: { id: invoice.patientId } });
  }

  console.log(`Updated the last restorative info for ${invoices.length} patients. accountId=${accountId}`);

  return null;
}

/**
 * checks if the most recent Restorative has been run before for an account
 * if it has only do it for patients who have Restorative procedures
 * created, updated, or deleted recently
 * @param  {[uuid]} accountId
 */
export async function mostRecentRestorative(accountId) {
  const configs = await getAccountCronConfigurations(accountId);
  let date;
  for (let i = 0; i < configs.length; i += 1) {
    if (configs[i].name === 'CRON_LAST_RESTORATIVE') {
      date = configs[i].value;
    }
  }
  // check if there's a date for the last cron for this account
  // if there is we find patients with newer invoices else
  // do the whole
  if (!date) {
    await updateMostRecentRestorative(accountId);
  } else {
    const patientIds = await getPatientsChangedDeliveredProcedure(date, accountId);
    await updateMostRecentRestorative(accountId, patientIds);
  }

  await updateAccountCronConfigurations({
    name: 'CRON_LAST_RESTORATIVE',
    value: moment().toISOString(),
  }, accountId);
}

export default async function mostRecentRestorativeAllAccounts() {
  const accounts = await Account.findAll();

  for (let i = 0; i < accounts.length; i += 1) {
    console.log(`Updating the last restorative info for ${accounts[i].name}. accountId=${accounts[i].id}`);
    await mostRecentRestorative(accounts[i].id);
  }
}

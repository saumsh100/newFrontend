
import moment from 'moment-timezone';
import { Account, SentRecall, Recall } from '../../_models';
import { mapPatientsToRecalls } from './helpers';
import sendRecall from './sendRecall';

/**
 * sendRecallsForAccount is an async function that will send recalls for the data passed in
 * by calling the composable functions to assemble patients that needs recall comms and then looping
 * through them and sending the appropriate comms
 *
 * - call mapPatientsToRecalls to grab that patients that each recall email needs to send to
 *     - this list is organized for success or error
 * - batchSave failed recalls
 * - loop through successful recalls
 *     - sendRecall. if error: do nothing, SentRecall isSent=false by default and contiue
 *                   else update isSent=true and add to sentRecallsId
 * - publish event that recalls were sent (things like Correspondence need this)
 *
 * @param account
 * @param date
 * @returns {Promise.<void>}
 */
export async function sendRecallsForAccount(account, date, pubSocket) {
  // TODO: make console.logs explicit like reminders
  console.log(`Sending recalls for ${account.name}`);
  const { recalls, name } = account;

  const recallsPatients = await mapPatientsToRecalls({
    recalls,
    account,
    startDate: date,
  });

  let i;
  for (i = 0; i < recalls.length; i++) {
    const recall = recalls[i];
    const { errors, success } = recallsPatients[i];
    const { primaryTypes, interval } = recall;

    try {
      const recallName = `'${interval} ${primaryTypes.join(' & ')}'`;

      console.log(`-- Sending ${recallName} reminder...`);
      console.log(`---- ${errors.length} => sentRecalls that would fail`);

      // Save failed sentRecalls from errors
      const failedSentRecalls = errors.map(({ errorCode, patient, primaryType }) => ({
        recallId: recall.id,
        accountId: account.id,
        patientId: patient.id,
        lengthSeconds: recall.lengthSeconds,
        primaryType,
        errorCode,
      }));

      await SentRecall.bulkCreate(failedSentRecalls);
    } catch (err) {
      console.error('FAILED bulkSave of failed sentRecalls', err);
    }

    // Save ids of recalls sent as we are sending them
    const sentRecallsIds = [];

    console.log(`---- ${success.length} => recall that should succeed`);
    for (const { patient, primaryType } of success) {
      const isHygiene = patient.hygiene;

      // Check if latest appointment is within the recall window
      const sentRecall = await SentRecall.create({
        recallId: recall.id,
        accountId: account.id,
        patientId: patient.id,
        lengthSeconds: recall.lengthSeconds,
        interval: recall.interval,
        primaryType,
        isHygiene,
      });

      let dueDate = account.timezone ?
        moment.tz(patient.dueForRecallExamDate, account.timezone) :
        moment(patient.dueForRecallExamDate);

      if (isHygiene) {
        dueDate = account.timezone ?
          moment.tz(patient.dueForHygieneDate, account.timezone) :
          moment(patient.dueForHygieneDate);
      }

      try {
        dueDate = dueDate.toISOString();
        await sendRecall[primaryType]({
          patient,
          account,
          sentRecall,
          recall,
          dueDate,
        });

        console.log(`${primaryType} recall SENT to ${patient.firstName} ${patient.lastName} for ${account.name}!`);
      } catch (error) {
        console.log(`${primaryType} recall NOT SENT to ${patient.firstName} ${patient.lastName} for ${name} because:`);
        console.error(error);
        continue;
      }

      await sentRecall.update({ isSent: true });

      sentRecallsIds.push(sentRecall.id);
    }

    // TODO: shouldn't we will send? keep things loggable?
    if (sentRecallsIds.length) {
      pubSocket && await pubSocket.publish('RECALL:SENT:BATCH', JSON.stringify(sentRecallsIds));
    }
  }
}

/**
 * computeRecallsAndSend is an async function that will fetch all accounts that canSendRecalls and
 * its active Recall touchpoints and then loop through each account to send those recall touchpoints
 *
 * @param {startDate}
 * @param {endDate}
 * @param {publishSocket} TODO: rename this to be consistent
 * @returns undefined;
 */
export async function computeRecallsAndSend({ date, publishSocket }) {
  // TODO: Create a fetcher function just like reminders has
  const accounts = await Account.findAll({
    where: { canSendRecalls: true },

    include: [{
      model: Recall,
      as: 'recalls',
      where: {
        isDeleted: false,
        isActive: true,
      },
    }],
  });

  for (const account of accounts) {
    // use `exports.` because we can mock it and stub it in test suite

    // TODO: use string comparison '11:00:00' > '11:00:01'
    const startHour = Number(account.recallStartTime.split(':')[0]);
    const startMin = Number(account.recallStartTime.split(':')[1]);

    const endHour = Number(account.recallEndTime.split(':')[0]);
    const endMin = Number(account.recallEndTime.split(':')[1]);

    const startDate = account.timezone ?
      moment.tz(date, account.timezone).hours(startHour).minutes(startMin).toISOString() :
      moment(date).hours(startHour).minutes(startMin).toISOString();

    const endDate = account.timezone ?
      moment.tz(date, account.timezone).hours(endHour).minutes(endMin).toISOString() :
      moment(date).hours(endHour).minutes(endMin).toISOString();

    const dateNow = moment(date);

    if ((dateNow.isBefore(endDate) && dateNow.isAfter(startDate))
     || ((dateNow.isSame(startDate) || dateNow.isSame(endDate)))
    ) {
      await exports.sendRecallsForAccount(account.get({ plain: true }), date, publishSocket);
    }
  }
}

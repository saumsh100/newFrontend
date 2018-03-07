
import moment from 'moment';
import 'moment-timezone';
import omit from 'lodash/omit';
import uniqBy from 'lodash/uniqBy';
import GLOBALS from '../../config/globals';
import {
  Appointment,
  Patient,
  SentRecall,
  Recall,
  sequelize,
} from '../../_models';
import { generateOrganizedPatients, organizeForOutbox } from '../comms/util';
import { sortIntervalAscPredicate, convertIntervalStringToObject } from '../../util/time';

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
export async function mapPatientsToRecalls({ recalls, account, startDate, endDate }) {
  const seen = {};
  const recallsPatients = [];
  for (const recall of recalls) {
    // Get patients whose last appointment is associated with this recall
    const patients = await exports.getPatientsForRecallTouchPoint({ recall, account, startDate, endDate });

    // If it has been seen by an earlier recall (farther away from due date), ignore it!
    // This is why the order or recalls is so important
    const unseenPatients = patients.filter(p => !seen[p.id]);

    // Now add it to the seen map
    unseenPatients.forEach(p => seen[p.id] = true);

    recallsPatients.push({
      ...generateOrganizedPatients(unseenPatients, recall.primaryTypes),
      recall,
    });
  }

  return recallsPatients;
}

/**
 * [organizeRecallsOutboxList groups recalls to send by patients and adds the sendDate
 * using the accounts timezone and global configs ]
 * @param  {[array]} outboxList [array of objects of recalls to send]
 * @param  {[object]} recall     [recall model]
 * @param  {[object]} account    [account model]
 * @return {[array]}            [array of objects with patient, sendDate and recall types]
 */
export function organizeRecallsOutboxList(outboxList, recall, account) {
  // Assume patient.id is the unique indicator
  // (shouldn't be multiple different reminders going out to same appointment)
  const selectorPredicate = ({ patient }) => patient.id;
  const mergePredicate = (groupedArray) => {
    const primaryTypes = groupedArray.map(item => item.primaryType);
    const newObj = {
      ...groupedArray[0],
      primaryTypes,
    };

    return omit(newObj, 'primaryType');
  };

  const result = organizeForOutbox(outboxList, selectorPredicate, mergePredicate);

  return result.map((p) => {
    p.recall = recall;

    let dateWithZone;

    if (p.patient.hygiene) {
      dateWithZone = account.timezone ? moment.tz(p.patient.lastHygieneDate, account.timezone)
        : moment(p.patient.lastHygieneDate);
    } else {
      dateWithZone = account.timezone ? moment.tz(p.patient.lastRecallDate, account.timezone)
        : moment(p.patient.lastHygieneDate);
    }

    const startHour = Number(account.recallStartTime.split(':')[0]);
    const startMin = Number(account.recallStartTime.split(':')[1]);

    p.sendDate = dateWithZone
      .add(1, 'days')
      .add(convertIntervalStringToObject(p.patient.insuranceInterval || account.hygieneInterval))
      .subtract(convertIntervalStringToObject(recall.interval))
      // we subtract the global hours and minutes, so that we get the correct date
      // the recall will run at.
      .subtract(startHour, 'hours')
      .subtract(startMin, 'minutes')
      // set the hour and minute to the correct time. Moment timezone will
      // set the right time in UTC for the timezone.
      .set('hour', GLOBALS.recalls.cronHour)
      .set('minute', GLOBALS.recalls.cronMinute)
      .toISOString();
    return p;
  });
}

/**
 * [getRecallsOutboxList fetches the recalls that will send in a range and
 * organizes them]
 * @param  {[string]} options.startDate [date as ISO string]
 * @param  {[string]} options.endDate   [date as ISO string]
 * @param  {[object]} options.account   [account model]
 * @return {[array]}                   [array of organized recalls to send]
 */
export async function getRecallsOutboxList({ startDate, endDate, account }) {
  if (moment(startDate).isAfter(endDate)) {
    throw {
      error: 'Start Date must before End Date',
    };
  }

  let recalls = await Recall.findAll({
    raw: true,
    where: {
      accountId: account.id,
      interval: {
        $ne: null,
      },
      isDeleted: false,
      isActive: true,
    },
  });

  // Sort recalls by interval so that we send to earliest first
  recalls = recalls.sort((a, b) => sortIntervalAscPredicate(a.interval, b.interval));

  const patients = await mapPatientsToRecalls({
    recalls,
    account,
    startDate,
    endDate,
  });

  let patientResults = [];

  patients.forEach(({ success, recall }) => {
    patientResults = patientResults.concat(organizeRecallsOutboxList(success, recall, account));
  });

  return patientResults
      .sort((a, b) => moment(a.sendDate).isAfter(b.sendDate));
}

/**
 * [getPatientsForRecallTouchPoint Calculate's the patients for a given account
 * that need to be sent recalls
 * EX: if the contCareInterval is set to 6 months and the Recall interval is
 * 1 month. Then the recalls will be sent out 5 months after the last hygiene date. This
 * only happens if there is not nextAppt, the patient is Active and there's no other Sent Recall
 * in the last 2 Weeks]
 * @param  {[object]} options.recall  [recall model]
 * @param  {[object]} options.account [account model]
 * @param  {[object]} options.date    [the date to use for the calculation - normally today]
 * @return {[array]}                 [an array of patient models that need to be sent recalls]
 */
export async function getPatientsForRecallTouchPoint({ recall, account, startDate, endDate }) {
  const twoWeeksAgo = moment(startDate).subtract(14, 'days');

  if (!endDate) {
    startDate = moment(startDate).toISOString();
    endDate = moment(startDate).add(convertIntervalStringToObject(account.recallBuffer)).toISOString();
  }

  const patientsHygieneWithInterval = await Patient.findAll({
    where: sequelize.and({
      accountId: account.id,
      status: 'Active',
      nextApptDate: null,
      insuranceInterval: {
        $ne: null,
      },
      lastHygieneDate: {
        $ne: null,
      },
      preferences: {
        recalls: true,
      },
    }, sequelize.literal(`'${endDate}' >= ("lastHygieneDate" + INTERVAL '1 days' + "insuranceInterval"::Interval - INTERVAL '${recall.interval}')`),
    sequelize.literal(`'${startDate}' < ("lastHygieneDate" + INTERVAL '1 days' + "insuranceInterval"::Interval - INTERVAL '${recall.interval}')`)),
    include: [{
      model: SentRecall,
      as: 'sentRecalls',
      where: {
        isSent: true,
        createdAt: {
          $gt: twoWeeksAgo._d,
        },
      },
      required: false,
    }],
  });

  const patientsHygieneWithOutInterval = await Patient.findAll({
    where: sequelize.and({
      accountId: account.id,
      status: 'Active',
      nextApptDate: null,
      insuranceInterval: null,
      lastHygieneDate: {
        $ne: null,
      },
      preferences: {
        recalls: true,
      },
    }, sequelize.literal(`'${endDate}' >= ("lastHygieneDate" + INTERVAL '1 days' + INTERVAL '${account.hygieneInterval}' - INTERVAL '${recall.interval}')`),
    sequelize.literal(`'${startDate}' < ("lastHygieneDate" + INTERVAL '1 days' + INTERVAL '${account.hygieneInterval}' - INTERVAL '${recall.interval}')`)),
    include: [{
      model: SentRecall,
      as: 'sentRecalls',
      where: {
        isSent: true,
        createdAt: {
          $gt: twoWeeksAgo._d,
        },
      },
      required: false,
    }],
  });

  const patientsRecallWithInterval = await Patient.findAll({
    where: sequelize.and({
      accountId: account.id,
      status: 'Active',
      nextApptDate: null,
      insuranceInterval: {
        $ne: null,
      },
      lastRecallDate: {
        $ne: null,
      },
      preferences: {
        recalls: true,
      },
    }, sequelize.literal(`'${endDate}' >= ("lastRecallDate" + INTERVAL '1 days' + "insuranceInterval"::Interval - INTERVAL '${recall.interval}')`),
    sequelize.literal(`'${startDate}' < ("lastRecallDate" + INTERVAL '1 days' + "insuranceInterval"::Interval - INTERVAL '${recall.interval}')`)),
    include: [{
      model: SentRecall,
      as: 'sentRecalls',
      where: {
        isSent: true,
        createdAt: {
          $gt: twoWeeksAgo._d,
        },
      },
      required: false,
    }],
  });

  const patientsRecallWithOutInterval = await Patient.findAll({
    where: sequelize.and({
      accountId: account.id,
      status: 'Active',
      nextApptDate: null,
      insuranceInterval: null,
      lastRecallDate: {
        $ne: null,
      },
      preferences: {
        recalls: true,
      },
    }, sequelize.literal(`'${endDate}' >= ("lastRecallDate" + INTERVAL '1 days' + INTERVAL '${account.recallInterval}' - INTERVAL '${recall.interval}')`),
    sequelize.literal(`'${startDate}' < ("lastRecallDate" + INTERVAL '1 days' + INTERVAL '${account.recallInterval}' - INTERVAL '${recall.interval}')`)),
    include: [{
      model: SentRecall,
      as: 'sentRecalls',
      where: {
        isSent: true,
        createdAt: {
          $gt: twoWeeksAgo._d,
        },
      },
      required: false,
    }],
  });

  const patientsHygiene = patientsHygieneWithInterval.concat(patientsHygieneWithOutInterval);
  const patientsRecall = patientsRecallWithInterval.concat(patientsRecallWithOutInterval);
  const patients = removeRecallDuplicates(patientsHygiene, patientsRecall);

  return shouldSendRecall(patients);
}

/**
 * [removeRecallDuplicates removes duplicate patients and adds a flag to whether
 * the patient's recall is due to hygiene or recall]
 * @param  {[array]} patientsHygiene [recalls due from lastHygieneDate]
 * @param  {[array]} patientsRecall  [recalls due from lastRecallDate]
 * @return {[array]}                 [resulting array]
 */
export function removeRecallDuplicates(patientsHygiene, patientsRecall) {
  patientsHygiene = patientsHygiene.map((ph) => {
    return {
      ...ph.get({ plain: true }),
      hygiene: true,
    };
  });

  patientsRecall = patientsRecall.map((ph) => {
    return {
      ...ph.get({ plain: true }),
      hygiene: false,
    };
  });

  const patients = patientsHygiene.concat(patientsRecall);

  return uniqBy(patients, 'id');
}

export function shouldSendRecall(patients) {
  return patients.filter(p => !p.sentRecalls[0]);
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

  // Recalls work around dueDate, whereas Reminders work around appointment.startDate
  const recallSeconds = dueDateSeconds - recall.lengthSeconds;

  // Get how long ago last appointment was
  const appointmentTimeAwaySeconds = moment(date).diff(startDate) / 1000;

  // Determine if the dueDate from  last appointment fits into this recall (with a buffer)
  const isDue = (recallSeconds <= appointmentTimeAwaySeconds) &&
    (appointmentTimeAwaySeconds <= (recallSeconds + DEFAULT_RECALL_BUFFER));

  // If I sent a 2week PAST dueDate, don't send a 1week PAST dueDate, stick to recalls
  // further down the line
  const recallAlreadySentOrLongerAway = sentRecalls.some((sentRecall) => {
    return recall.lengthSeconds >= sentRecall.lengthSeconds;
  });

  return isDue && !recallAlreadySentOrLongerAway && preferences.reminders;
}

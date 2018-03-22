
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

    let dateWithZone = account.timezone ?
      moment.tz(p.patient.dueForRecallExamDate, account.timezone) :
      moment(p.patient.dueForRecallExamDate);

    if (p.patient.hygiene) {
      dateWithZone = account.timezone ?
        moment.tz(p.patient.dueForHygieneDate, account.timezone) :
        moment(p.patient.dueForHygieneDate);
    }

    const startHour = Number(account.recallStartTime.split(':')[0]);
    const startMin = Number(account.recallStartTime.split(':')[1]);

    p.sendDate = dateWithZone
      .subtract(convertIntervalStringToObject(recall.interval))
      .hours(startHour)
      .minutes(startMin)
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

  // No need to sort by sendDate here...
  return patientResults;
}

/**
 * getPatientsForRecallTouchPoint is an async functino that calculates the patients for a given account
 * that need to be sent the supplied recall touchpoint based on the patient's dueDate
 *
 * ie.// If a patient's dueDate is in 1 month and a recall touchpoint with an interval of
 * 1 month was supplied. That patient would be return. However a patient that is not due or not
 * due in the exact time (+/- the buffer time) then they are not returned.
 *
 * @param  {recall} recall model
 * @param  {account} account model
 * @param  {date} the date to use for the calculation - normally today
 * @return [patientsWithData] an array of patient models that need to be sent recalls
 */
export async function getPatientsForRecallTouchPoint({ recall, account, startDate, endDate }) {
  /*

  So if we are running this with the following criteria, the start & end range with which we search
  for dueDates becomes:

  Criteria:

  recall.interval = '1 months'
  account.recallBuffer = '1 weeks'
  startDate = March 8th 2018 11:00am
  endDate = March 8th 2018 11:30am

  Outcome:

  start = April 1st 2018 11:00am
  end =  April 8th 2018 11:30am

  */
  const recallIntervalObject = convertIntervalStringToObject(recall.interval);
  const recallBufferObject = convertIntervalStringToObject(account.recallBuffer);
  const start = moment(startDate).add(recallIntervalObject).subtract(recallBufferObject).toISOString();
  const end = moment(endDate || startDate).add(recallIntervalObject).toISOString();

  const baseWhereQuery = {
    accountId: account.id,
    status: 'Active',
    preferences: { recalls: true },
  };

  const twoWeeksAgo = moment(startDate).subtract(14, 'days');
  const includeArray = [{
    model: SentRecall,
    as: 'sentRecalls',
    where: {
      isSent: true,
      createdAt: {
        $gt: twoWeeksAgo._d,
      },
    },

    required: false,
  }];

  const patientsDueForHygiene = await Patient.findAll({
    include: includeArray,
    where: {
      ...baseWhereQuery,
      dueForHygieneDate: {
        $not: null,
        $gte: start,
        $lt: end,
      },
    },
  });

  const patientsDueForRecall = await Patient.findAll({
    include: includeArray,
    where: {
      ...baseWhereQuery,
      dueForRecallExamDate: {
        $not: null,
        $gte: start,
        $lt: end,
      },
    },
  });

  const patients = removeRecallDuplicates(patientsDueForHygiene, patientsDueForRecall);
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

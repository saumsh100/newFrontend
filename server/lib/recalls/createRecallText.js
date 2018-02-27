
import moment from 'moment-timezone';
import { s2w } from '../../util/time';
import { convertIntervalStringToObject, convertIntervalToMs } from '../../util/time';

// TODO: generateBookingUrl
// TODO; format phone number

const RecallsText = {
  ['1 months']: ({ account, patient, dueDate, link }) => {
    return `Hi ${patient.firstName}, this is ${account.name}. We're reaching out because you're ` +
      `almost due for your next dental appointment. You can schedule your appointment for anytime after ` +
      `${dueDate}, by clicking this link: ${link}`;
  },

  ['1 weeks']: ({ account, patient, dueDate, link }) => {
    return `${patient.firstName}, this is ${account.name}. Just a reminder that you're due ` +
      `for your next dental visit in 1 week. You can schedule your appointment for anytime after ` +
      `${dueDate} by clicking this link: ${link}`;
  },

  ['-1 weeks']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-1 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, regular cleaning visits are essential to a lifetime of healthy teeth. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-2 months']: ({ account, patient, lastApptDate, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're last dental appointment was on ${lastApptDate} ` +
      `and you are 8 weeks past due. ` +
      `Please schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-4 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-6 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-8 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-10 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-12 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-14 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-16 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-18 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-20 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },

  ['-24 months']: ({ account, patient, link }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${link}`;
  },
};

export default function createRecallText({ patient, account, recall, link }) {
  const dueDate = moment().add(convertIntervalStringToObject(recall.interval)).format('dddd, MMMM Do');
  const lastApptDate = moment(patient.lastApptDate).format('dddd, MMMM Do');
  return RecallsText[recall.interval]({ patient, account, dueDate, lastApptDate, link });
}

export function getRecallTemplateName({ recall }) {
  let { interval } = recall;

  // Calculate before we remove the negative sign
  const numSeconds = convertIntervalToMs(interval);

  // Remove the negative sign
  interval = interval.indexOf('-') > -1 ?
    interval.slice(1, interval.length) :
    interval;

  // Capitalize the units of time in the interval
  interval = interval.replace(/\b\w/g, l => l.toUpperCase());

  const subtype = numSeconds >= 0 ? 'Before' : 'After';
  return `Patient Recall - ${interval} ${subtype}`;
}

const RecallsPreviewMergeVars = {
  '1 months': [{ name: 'WEEKSBEFORE_DUEDATE', content: '4' }],
  '1 weeks': [{ name: 'WEEKSBEFORE_DUEDATE' , content: '1' }],
  '-1 weeks': [{ name: 'WEEKS_PASTDUE' , content: '1' }],
  '-1 months': [{ name: 'MONTHS_PASTDUE', content: '1' }],
  '-2 months': [{ name: 'MONTHS_PASTDUE', content: '2' }],
  '-4 months': [{ name: 'MONTHS_PASTDUE', content: '4' }],
  '-6 months': [{ name: 'MONTHS_PASTDUE', content: '6' }],
  '-8 months': [{ name: 'MONTHS_PASTDUE', content: '8' }],
  '-10 months': [{ name: 'MONTHS_PASTDUE', content: '10' }],
  '-12 months': [{ name: 'MONTHS_PASTDUE', content: '12' }],
  '-14 months': [{ name: 'MONTHS_PASTDUE', content: '14' }],
  '-16 months': [{ name: 'MONTHS_PASTDUE', content: '16' }],
  '-18 months': [{ name: 'MONTHS_PASTDUE', content: '18' }],
};

export function getPreviewMergeVars({ recall }) {
  return RecallsPreviewMergeVars[recall.interval];
}


import moment from 'moment-timezone';
import { s2w } from '../../util/time';
import { convertIntervalStringToObject, convertIntervalToMs } from '../../util/time';

// TODO: generateBookingUrl
// TODO; format phone number

const generateBookingUrl = ({ account }) => {
  return `${account.website}?cc=book`;
};

const RecallsText = {
  ['1 months']: ({ account, patient, dueDate }) => {
    return `Hi ${patient.firstName}, this is ${account.name}. We're reaching out because you're ` +
      `almost due for your next dental appointment. You can schedule your appointment for anytime after ` +
      `${dueDate}, by clicking this link: ${generateBookingUrl({ account })}`;
  },

  ['1 weeks']: ({ account, patient, dueDate }) => {
    return `${patient.firstName}, this is ${account.name}. Just a reminder that you're due ` +
      `for your next dental visit in 1 week. You can schedule your appointment for anytime after ` +
      `${dueDate} by clicking this link: ${generateBookingUrl({ account })}`;
  },

  ['-1 weeks']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-1 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, regular cleaning visits are essential to a lifetime of healthy teeth. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-2 months']: ({ account, patient, lastApptDate }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're last dental appointment was on ${lastApptDate} ` +
      `and you are 8 weeks past due. ` +
      `Please schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-4 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-6 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-8 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-10 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-12 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-14 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-16 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-18 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-20 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  ['-24 months']: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },
};

export default function createRecallText({ patient, account, recall }) {
  console.log(recall.interval);
  const dueDate = moment().add(convertIntervalStringToObject(recall.interval)).format('dddd, MMMM Do');
  const lastApptDate = moment(patient.lastApptDate).format('dddd, MMMM Do');
  return RecallsText[recall.interval]({ patient, account, dueDate, lastApptDate });
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

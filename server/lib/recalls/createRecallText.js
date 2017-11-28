
import moment from 'moment-timezone';
import { s2w } from '../../util/time';

// TODO: generateBookingUrl
// TODO; format phone number

const generateBookingUrl = ({ account }) => {
  return `${account.website}?cc=book`;
};

const RecallsText = {
  [4]: ({ account, patient, dueDate }) => {
    return `Hi ${patient.firstName}, this is ${account.name}. We're reaching out because you're ` +
      `almost due for your next dental appointment. You can schedule your appointment for anytime after ` +
      `${dueDate}, by clicking this link: ${generateBookingUrl({ account })}`;
  },

  [1]: ({ account, patient, dueDate }) => {
    return `${patient.firstName}, this is ${account.name}. Just a reminder that you're due ` +
      `for your next dental visit in 1 week. You can schedule your appointment for anytime after ` +
      `${dueDate} by clicking this link: ${generateBookingUrl({ account })}`;
  },

  [-1]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-4]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, regular cleaning visits are essential to a lifetime of healthy teeth. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-8]: ({ account, patient, lastApptDate }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're last dental appointment was on ${lastApptDate} ` +
      `and you are 8 weeks past due. ` +
      `Please schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-12]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-20]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-28]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-36]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-44]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-52]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-60]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-68]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-76]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },

  [-84]: ({ account, patient }) => {
    return `Hi ${patient.firstName}, this is a reminder that you're past due for your dental appointment. ` +
      `You can schedule your appointment by clicking this link: ` +
      `${generateBookingUrl({ account })}`;
  },
};

export default function createRecallText({ patient, account, recall }) {
  const numWeeks = s2w(recall.lengthSeconds);
  const dueDate = moment().add(recall.lengthSeconds, 'seconds').format('dddd, MMMM Do');
  const lastApptDate = moment(patient.lastApptDate).format('dddd, MMMM Do');
  return RecallsText[numWeeks]({ patient, account, dueDate, lastApptDate });
}

export function getRecallTemplateName({ recall }) {
  const numWeeks = Math.abs(s2w(recall.lengthSeconds));
  const subtype = recall.lengthSeconds >= 0 ? 'Before' : 'After';
  return `Patient Recall - ${numWeeks} Week ${subtype}`;
}


import { dateFormatter, sortAsc } from '@carecru/isomorphic';

const getDateAndTime = (date, timezone) => ({
  date: dateFormatter(date, timezone, 'MMMM Do'),
  time: dateFormatter(date, timezone, 'h:mma'),
});

const generateFamilyDetails = (patient, appointment, dependants, timezone) => {
  const familyMembers = appointment ? [patient, ...dependants] : dependants;

  return familyMembers.sort((
    { appointment: { startDate: a } },
    { appointment: { startDate: b } },
  ) => sortAsc(a, b)).map(({ appointment: { startDate }, firstName, lastName }) => {
    const { date, time } = getDateAndTime(startDate, timezone);
    return `\n${firstName} ${lastName}\n${date} at ${time}\n`;
  }).join('');
};

// Family Reminder text for a single family member EXCLUDING the family head.
const single = {
  unconfirmed: ({ patient, dependants, account }) => {
    const familyMember = dependants[0];
    const { appointment } = familyMember;

    const { date, time } = getDateAndTime(appointment.startDate, account.timezone);

    return `Hi ${patient.firstName}, this is a friendly reminder that ${familyMember.firstName} ${familyMember.lastName}'s next appointment with ${account.name} is on ${date} at ${time}. Please reply with "C" to confirm your appointment.`;
  },

  confirmed: ({ patient, dependants, account }) => {
    const familyMember = dependants[0];
    const { appointment } = familyMember;

    const { date, time } = getDateAndTime(appointment.startDate, account.timezone);

    return `Hi ${patient.firstName}, this is a friendly reminder that ${familyMember.firstName} ${familyMember.lastName}'s next appointment with ${account.name} is on ${date} at ${time}. We look forward to seeing you.`;
  },
};

// Family Reminder text for multiple family members EXCLUDING the family head.
const multiple = {
  unconfirmed: ({ patient, dependants, appointment, account }) => `Hi ${patient.firstName}, this is a friendly reminder that the following family members have upcoming appointments with ${account.name}.\n${generateFamilyDetails(patient, appointment, dependants, account.timezone)}\nPlease reply with "C" to confirm your appointment.`,

  confirmed: ({ patient, dependants, appointment, account }) => `Hi ${patient.firstName}, this is a friendly reminder that the following family members have upcoming appointments with ${account.name}.\n${generateFamilyDetails(patient, appointment, dependants, account.timezone).replace(',', '')}\nWe look forward to seeing you.`,
};

// Family Reminder text for single/multiple family members INCLUDING the family head.
const self = {
  unconfirmed: ({ patient, dependants, appointment, account }) => `Hi ${patient.firstName}, this is a friendly reminder that you and the following family members have upcoming appointments with ${account.name}.\n${generateFamilyDetails(patient, appointment, dependants, account.timezone)}\nPlease reply with "C" to confirm your appointment.`,

  confirmed: ({ patient, dependants, appointment, account }) => `Hi ${patient.firstName}, this is a friendly reminder that you and the following family members have upcoming appointments with ${account.name}.\n${generateFamilyDetails(patient, appointment, dependants, account.timezone)}\nWe look forward to seeing you.`,
};

const familyText = {
  single,
  multiple,
  self,
};

function getTemplateType(appointment, dependants) {
  if (appointment) {
    return 'self';
  }

  return dependants.length === 1 ? 'single' : 'multiple';
}

export default function createFamilyReminderText({
  patient,
  account,
  appointment,
  isConfirmable,
  dependants,
}) {
  const templateType = getTemplateType(appointment, dependants);
  const confirmType = isConfirmable ? 'unconfirmed' : 'confirmed';
  return familyText[templateType][confirmType]({
    patient,
    appointment,
    account,
    dependants,
  });
}


import { generateFamilyDetails, getDateAndTime, isFamily } from '../util';
import { formatPhoneNumber } from '../../../../util/formatters';

const NUM_DAYS = 2;

/**
 * Generates the reminder values object based of the appointment and patient data.
 * @param props
 * @return {Promise<*>}
 */
export default async function getReminderValue(props) {
  const { patient, account, appointment, reminder, dependants } = props;

  const action = reminder.isCustomConfirm ? 'pre-confirm' : 'confirm';
  const { name } = account;

  const defaultParams = {
    patient,
    account,
    name,
  };

  if (isFamily(dependants)) {
    return getFamilyValues({
      appointment,
      dependants,
      ...defaultParams,
    });
  }

  return getPatientValues({
    action,
    ...getDateAndTime(appointment.startDate, account.timezone),
    ...defaultParams,
  });
}

/**
 * Generates the reminder values object for family reminders
 * @param appointment
 * @param patient
 * @param dependants
 * @param account
 * @param name
 * @return {
 *  {familyDetails}&{date, time}&{familyMember}&{familyHead: {firstName: *}, account: {name: *}}
 * }
 */
function getFamilyValues({ appointment, patient, dependants, account, name }) {
  const details = generateFamilyDetails(
    appointment ? [patient, ...dependants] : dependants,
    account.timezone,
  );

  return {
    account: {
      name,
    },
    familyHead: {
      firstName: patient.firstName,
    },
    ...details,
  };
}

/**
 * Generates the reminder values object for single patient reminders
 * @param patient
 * @param account
 * @param action
 * @param date
 * @param name
 * @param time
 * @return {{date: *, firstName: *, phoneNumber: *, name: *, action: *, numDays: number, time: *}}
 */
function getPatientValues({ patient, account, action, date, name, time }) {
  const numDays = NUM_DAYS;
  const { firstName } = patient;
  const phoneNumber = formatPhoneNumber(account.destinationPhoneNumber);

  return {
    action,
    date,
    firstName,
    name,
    numDays,
    phoneNumber,
    time,
  };
}

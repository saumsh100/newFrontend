
import { getDateAndTime } from '../util';

/**
 * Generates the template values for the confirmation text based of the sent reminder's data
 * @param isFamily
 * @param props
 * @return {*}
 */
export default function getConfirmationTextValue({ isFamily, ...props }) {
  return !isFamily
    ? getPatientConfirmationTextValue(props)
    : getFamilyConfirmationTextValue(props);
}

/**
 * Generates the single patient reminder confirmation text value param for the template
 * @param startDate
 * @param name
 * @param timezone
 * @param familyHead
 * @param action
 * @return {{date, time}&{patient: {firstName: *}, action: *, account: {name: *}}}
 */
function getPatientConfirmationTextValue({
  appointment: { startDate },
  account: { name, timezone },
  patient: familyHead,
  action,
}) {
  return {
    action,
    patient: {
      firstName: familyHead.firstName,
    },
    account: {
      name,
    },
    ...getDateAndTime(startDate, timezone),
  };
}

/**
 * Generates the family reminder confirmation text value param for the template
 * @param sentRemindersPatients
 * @param action
 * @param familyHead
 * @param name
 * @param timezone
 * @return {*}
 */
function getFamilyConfirmationTextValue({
  sentRemindersPatients,
  action,
  patient: familyHead,
  account: { name, timezone },
}) {
  const [
    {
      patient: familyMember,
      appointment: { startDate },
    },
  ] = sentRemindersPatients;

  const defaultFamilyValues = {
    action,
    familyHead: {
      firstName: familyHead.firstName,
    },
    account: {
      name,
    },
    ...getDateAndTime(startDate, timezone),
  };

  return sentRemindersPatients.length > 1
    ? defaultFamilyValues
    : {
      ...defaultFamilyValues,
      familyMember: {
        firstName: familyMember.firstName,
      },
    };
}

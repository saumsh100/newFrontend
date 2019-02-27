
import { Practitioner, WeeklySchedule } from 'CareCruModels';
import {
  cleanUpWeeklySchedule,
  saveWeeklyScheduleWithDefaults,
} from '../../_models/WeeklySchedule';
import { fetchAccountWeeklySchedule } from './fetchSchedule';

/**
 * addCustomScheduleToPractitioner is an async function that will clone an account's
 * officeHours and set it as the practitioner's weeklySchedule and then update the practitioner
 * model to reflect a custom schedule being used
 *
 * NOTE: This function was created to keep the client-side working as it is now
 * its not a long-term need
 *
 * @param practitioner
 * @param defaultBody
 * @return {Promise<*>}
 */
export async function addCustomScheduleToPractitioner(
  { practitioner },
  defaultBody,
) {
  // Clone the account's officeHours to simplify setting the practitioner's default weeklySchedule
  const { accountId } = practitioner;
  const schedule = defaultBody || await fetchAccountWeeklySchedule({ accountId });

  const practitionerSchedule = await saveWeeklyScheduleWithDefaults(
    cleanUpWeeklySchedule(schedule),
    WeeklySchedule,
  );

  // Update the practitioner model with the new data
  return Practitioner.update(
    {
      isCustomSchedule: true,
      weeklyScheduleId: practitionerSchedule.id,
    },
    { where: { id: practitioner.id },
      returning: true },
  );
}

/**
 * removeCustomScheduleFromPractitioner is an async function that will delete a practitioner's
 * weeklySchedule and update the model to not utilize a custom schedule anymore
 *
 * NOTE: This function was created to keep the client-side working as it is now, its not
 * a long-term need
 *
 * @param practitioner
 * @return {Promise<*>}
 */
export async function removeCustomScheduleFromPractitioner({ practitioner }) {
  // Delete the practitioner's weeklySchedule so we aren't hanging onto data
  await WeeklySchedule.destroy({
    where: { id: practitioner.weeklyScheduleId },
  });

  // Update the practitioner model with the new data
  return Practitioner.update(
    {
      isCustomSchedule: false,
      weeklyScheduleId: null,
    },
    { where: { id: practitioner.id } },
  );
}

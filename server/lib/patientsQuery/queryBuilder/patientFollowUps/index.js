
import { PatientFollowUp } from 'CareCruModels';

/**
 * Helper to add the correct where clause for completedAt attribute.
 * @param isCompleted
 * @return {*}
 */
const addCompletedAtAttr = isCompleted => ({
  completedAt: isCompleted ? { $ne: null } : { $eq: null },
});

/**
 * query builder for patientFollowUps
 * isCompleted = true: completed patient follow ups - returns all patients with at least 1
 * follow up with the completedAt timestamp with time zone field not equal to null
 * isCompleted = false: not completed patient follow ups - returns all patients with at least 1
 * follow up with the completedAt timestamp with time zone field equal to null
 * isCompleted = null: completed and not completed patient follow ups
 * @param isCompleted
 * @param startDate
 * @param endDate
 * @return {{[p: string]: *}}
 */
export default function patientFollowUps([isCompleted, startDate, endDate]) {
  return {
    include: [
      {
        model: PatientFollowUp,
        as: 'patientFollowUps',
        required: true,
        duplicating: false,
        attributes: [],
        where: {
          dueAt: { $between: [startDate, endDate] },
          ...(isCompleted === null ? {} : addCompletedAtAttr(isCompleted)),
        },
      },
    ],
    group: ['Patient.id'],
  };
}

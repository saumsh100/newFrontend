
import moment from 'moment-timezone';
import { Appointment } from '../../../../_models/index';

/**
 * builds a query object for sequelize query for missed and cancelled appointments segment.
 * @param duration
 * @param unit
 * @returns {
 *  { include: {model: *, as: string,
 *    where: {
 *      isMissed: boolean,
 *      isCancelled: boolean,
 *      isDeleted: boolean,
 *      isPending: boolean,
 *      startDate:{
 *        $between: *[]},
 *        patientId: {$not: null}}, attributes: Array, required: boolean, duplicating: boolean}[]}
 *        }
 */
export default function missedCancelled(duration = 14, unit = 'days') {
  return {
    include: [
      {
        model: Appointment,
        as: 'appointments',
        where: {
          $or: {
            isMissed: true,
            isCancelled: true,
          },
          isDeleted: false,
          isPending: false,
          startDate: {
            $between: [
              moment()
                .subtract(duration, unit)
                .toISOString(),
              new Date(),
            ],
          },
          patientId: { $not: null },
        },
        attributes: [],
        required: true,
        duplicating: false,
      },
    ],
  };
}

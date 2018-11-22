
import moment from 'moment';

/**
 * builds a query object for sequelize query for missed appointments segment.
 * @param days
 * @returns {
 *  {
 *    where: {nextApptId: null, nextApptDate: null, lastApptDate: {$between: any[]}}}
 *  }
 */
export default function missedPreAppointed(days = 30) {
  return {
    where: {
      nextApptId: null,
      nextApptDate: null,
      lastApptDate: {
        $between: [
          moment()
            .subtract(days, 'days')
            .toISOString(),
          new Date(),
        ],
      },
    },
  };
}

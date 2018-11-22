
import { PatientUser, Request, sequelize } from 'CareCruModels';

/**
 * builds a query object for sequelize query for the online requests quantity per Patient.
 * @param comparator
 * @param value
 * @returns {{
 *    attributes: *[][],
 *    include: {
 *      model: *,
 *      as: string,
 *      attributes: Array,
 *      duplicating: boolean,
 *      required: boolean,
 *      include: {
 *        model: *,
 *        as: string,
 *        attributes: Array,
 *        duplicating: boolean,
 *        required: boolean,
 *        where: {
 *          isCancelled: boolean,
 *          isConfirmed: boolean
 *        }
 *      }
 *    }[],
 *    group: string[],
 *    having: *[]
 *  }}
 */
export default function queryOnlineAppointments([comparator, value]) {
  return {
    attributes: [
      [
        sequelize.fn('count', sequelize.col('patientUser->requests.id')),
        'onlineRequestsCount',
      ],
    ],
    include: [
      {
        model: PatientUser,
        as: 'patientUser',
        attributes: [],
        duplicating: false,
        required: true,
        include: {
          model: Request,
          as: 'requests',
          attributes: [],
          duplicating: false,
          required: true,
          where: {
            isCancelled: false,
            isConfirmed: true,
          },
        },
      },
    ],
    group: ['Patient.id'],
    having: [
      {},
      sequelize.where(
        sequelize.fn('count', sequelize.col('patientUser->requests.id')),
        comparator,
        value,
      ),
    ],
  };
}

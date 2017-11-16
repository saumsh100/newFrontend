
import moment from 'moment';
import { Patient, SentReview } from '../../_models';
import { ManualLimitOffset } from './helpers';

export async function ReviewsFilter({ data }, filterIds, query, accountId) {
  try {
    let prevFilterIds = { id: { $not: null } }

    if (filterIds && filterIds.length) {
      prevFilterIds = {
        id: filterIds,
      };
    }

    const patientData = await Patient.findAndCountAll({
      raw: true,
      where: {
        accountId,
        ...prevFilterIds,
      },
      include: {
        model: SentReview,
        as: 'sentReviews',
        where: {
          accountId,
          createdAt: {
            $between: [moment(data[0]).toISOString(), moment(data[1]).toISOString()],
          },
        },
        attributes: [],
        required: true,
        duplicating: false,
      },
      group: ['Patient.id'],
      attributes: [
        'Patient.id',
        'Patient.firstName',
        'Patient.lastName',
        'Patient.nextApptDate',
        'Patient.lastApptDate',
        'Patient.birthDate',
        'Patient.status',
      ],
      ...query,
    });

    return ({
      rows: patientData.rows,
      count: patientData.count.length,
    });
  } catch (err) {
    console.log(err);
  }
}

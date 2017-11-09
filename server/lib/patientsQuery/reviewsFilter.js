
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

    const patientData = await SentReview.findAll({
      where: {
        accountId,
        createdAt: {
          $between: [moment(data[0]).toISOString(), moment(data[1]).toISOString()],
        },
      },
      include: {
        model: Patient,
        as: 'patient',
        where: {
          accountId,
          ...prevFilterIds,
        },
        attributes: [],
        duplicating: false,
        required: true,
      },
      group: ['patient.id'],
      attributes: [
        'patient.id',
        'patient.firstName',
        'patient.lastName',
        'patient.nextApptDate',
        'patient.lastApptDate',
        'patient.birthDate',
        'patient.status',
      ],
      raw: true,
    });

    const truncatedData = ManualLimitOffset(patientData, query);

    return ({
      rows: truncatedData,
      count: patientData.length,
    });

  } catch (err) {
    console.log(err);
  }
}

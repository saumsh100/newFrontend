
import moment from 'moment';
import { Patient, Appointment, SentRecall } from '../../_models';
import { ManualLimitOffset } from './helpers';

export async function RecallsFilter({ data, key }, filterIds, query, accountId) {
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
        model: SentRecall,
        as: 'sentRecalls',
        where: {
          accountId,
          primaryType: key,
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

export async function LastRecallFilter({ data, key }, filterIds, query, accountId) {
  try {
    let prevFilterIds = { id: { $not: null } }

    if (filterIds && filterIds.length) {
      prevFilterIds = {
        id: filterIds,
      };
    }

    const patientData = await SentRecall.findAll({
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
      group: ['patient.id', 'SentRecall.patientId', 'SentRecall.createdAt', 'SentRecall.primaryType'],
      attributes: [
        'patient.id',
        'patient.firstName',
        'patient.lastName',
        'patient.nextApptDate',
        'patient.lastApptDate',
        'patient.birthDate',
        'patient.status',
        'SentRecall.createdAt',
        'SentRecall.primaryType',
      ],
      order: [['patientId', 'desc'], ['createdAt', 'desc']],
      raw: true,
    });

    const recallData = calcLastRecallSent(patientData);

    const truncatedData = ManualLimitOffset(recallData, query);

    return ({
      rows: truncatedData,
      count: recallData.length,
    });
  } catch (err) {
    console.log(err);
  }
}


export function calcLastRecallSent(recallData) {
  let j = 0;
  const lastReminderData = [];
  while (j < recallData.length) {
    const currentPatient = recallData[j].id;
    lastReminderData.push(recallData[j]);
    let i = j;

    while (i < recallData.length && currentPatient === recallData[i].id) {
      i += 1;
    }

    j = i;
  }
  return lastReminderData;
}

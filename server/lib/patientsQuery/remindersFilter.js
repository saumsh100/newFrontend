
import moment from 'moment';
import { Patient, SentReminder } from '../../_models';
import { getIds } from './helpers';

export async function RemindersFilter({ data, key }, filterIds, query, accountId) {
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
        model: SentReminder,
        as: 'sentReminders',
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

export async function LastReminderFilter({ data }, filterIds, query, accountId) {
  try {
    let prevFilterIds = { id: { $not: null } }

    if (filterIds && filterIds.length) {
      prevFilterIds = {
        id: filterIds,
      };
    }

    const patientData = await SentReminder.findAll({
      where: {
        accountId,
        createdAt: {
          $between: [moment(data[0]).toISOString(), moment(data[1]).toISOString()],
          $notBetween: [moment(data[1]).toISOString(), moment().toISOString()],
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
      group: ['patient.id', 'SentReminder.patientId', 'SentReminder.createdAt', 'SentReminder.primaryType'],
      attributes: [
        'patient.id',
      ],
      order: [['patientId', 'desc'], ['createdAt', 'desc']],
      raw: true,
    });

    const reminderData = calcLastReminderSent(patientData);
    const patientIds = getIds(reminderData, 'id');

    return await Patient.findAndCountAll({
      raw: true,
      where: {
        accountId,
        id: patientIds,
      },
      ...query,
    });
  } catch (err) {
    console.log(err);
  }

}


export function calcLastReminderSent(reminderData) {
  let j = 0;
  const lastReminderData = [];
  while (j < reminderData.length) {
    const currentPatient = reminderData[j].id;
    lastReminderData.push(reminderData[j])
    let i = j;

    while (i < reminderData.length && currentPatient === reminderData[i].id) {
      i += 1;
    }

    j = i;
  }
  return lastReminderData;
}

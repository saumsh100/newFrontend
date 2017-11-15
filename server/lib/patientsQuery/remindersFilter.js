
import moment from 'moment';
import { Patient, SentReminder } from '../../_models';
import { ManualLimitOffset } from './helpers';

export async function RemindersFilter({ data, key }, filterIds, query, accountId) {
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
        primaryType: key,
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

export async function LastReminderFilter({ data, key }, filterIds, query, accountId) {
  try {
    let prevFilterIds = { id: { $not: null } };

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
        'patient.firstName',
        'patient.lastName',
        'patient.nextApptDate',
        'patient.lastApptDate',
        'patient.birthDate',
        'patient.status',
        'SentReminder.createdAt',
        'SentReminder.primaryType',
      ],
      order: [['patientId', 'desc'], ['createdAt', 'desc']],
      raw: true,
    });

    const reminderData = calcLastReminderSent(patientData);

    const truncatedData = ManualLimitOffset(reminderData, query);

    return ({
      rows: truncatedData,
      count: reminderData.length,
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

    while(i < reminderData.length && currentPatient === reminderData[i].id) {
      i += 1;
    }

    j = i;
  }
  return lastReminderData;
}

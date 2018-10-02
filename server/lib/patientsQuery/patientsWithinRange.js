
import moment from 'moment';
import { Patient, Appointment } from '../../_models';
import Appointments from '../../../client/entities/models/Appointments';

/**
 * getPatientsWithAppInRange gets all patients who had appointments within a
 * date range
 * @param accountId
 * @param patientFilters
 * @param startDate
 * @param endDate
 * @param attributes
 * @returns an array of patients
 */
export async function getPatientsWithAppInRange(accountId, patientFilters, startDate, endDate, attributes) {
  const sDate = startDate || moment().subtract(5, 'years').toISOString();
  const eDate = endDate || moment().toISOString();

  return await Patient.findAll({
    raw: true,
    attributes,
    where: {
      accountId,
      status: 'Active',
      ...patientFilters,
    },
    include: {
      model: Appointment,
      as: 'appointments',
      where: {
        accountId,
        ...appointmentQueryParams(sDate, eDate),
      },
      attributes: [],
      required: true,
    },
    group: ['Patient.id'],
  });
}

/**
 * countPatientsWithAppInRange counts all patients who had appointments within a
 * date range
 * @param accountId
 * @param patientFilters
 * @param startDate
 * @param endDate
 * @returns a count of patients
 */
export async function countPatientsWithAppInRange(accountId, patientFilters, startDate, endDate) {
  const sDate = startDate || moment().subtract(5, 'years').toISOString();
  const eDate = endDate || moment().toISOString();

  return await Patient.count({
    where: {
      accountId,
      status: 'Active',
      ...patientFilters,
    },
    include: {
      model: Appointment,
      as: 'appointments',
      where: {
        accountId,
        ...appointmentQueryParams(sDate, eDate),
      },
      required: true,
    },
    distinct: true,
  });
}

function appointmentQueryParams(startDate, endDate) {
  return {
    ...Appointments.getCommonSearchAppointmentSchema(),
    startDate: {
      $between: [startDate, endDate],
    },
    patientId: {
      $not: null,
    },
  };
}

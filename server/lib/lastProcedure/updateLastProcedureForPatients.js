
import moment from 'moment';
import difference from 'lodash/difference';
import {
  Appointment,
  DeliveredProcedure,
  Patient,
  sequelize,
} from 'CareCruModels';
import produceLikeQuery from '../shared/produceLikeQuery';
import logger from '../../config/logger';
import Appointments from '../../../client/entities/models/Appointments';

/**
 * updateLastProcedureForPatients is an async function that calculates the most recent procedureDates for patients
 * and updates the patients with the dates under the supplied last____Date attribute
 *
 * - it also will add an appointmentId if it can find one so that we can link people to the appointment
 * that delivered the procedure (only needed this way cause of Tracker at the moment)
 *
 * @param  {uuid} config.accountId - UUID of the clinic being udpated
 * @param  {[uuid]} config.patientIds - UUIDs of the patients needing an update
 * @param  {string} config.procedureAttr - string of the lastProcedureDate's field name on the Patient model
 * @param  {string} config.procedureApptAttr - string of the lastProcedureApptId's field name on the Patient model
 * @param  {[string]} config.procedureCodes - strings that we designate to set a certain type of last____Date
 * @param  {integer} config.numHoursNearDate - integer for num of hours we search around lastProcedureDate for an appt
 */
export default async function updateLastProcedureForPatients(config) {
  const {
    accountId,
    patientIds,
    procedureAttr,
    procedureApptAttr,
    procedureCodes,
    numHoursNearDate,
  } = config;

  const patientIdsQuery = patientIds || { $ne: null };

  // Group the accounts ledger for the supplied patients and group them by patientId
  // and add a virtual attribute for the soonest entryDate
  const ledgerByPatient = await DeliveredProcedure.findAll({
    where: {
      accountId,
      isCompleted: true,
      procedureCode: produceLikeQuery(procedureCodes),
      patientId: patientIdsQuery,
    },
    attributes: [
      [sequelize.fn('MAX', sequelize.col('entryDate')), 'maxDate'],
      'patientId',
    ],
    group: ['patientId'],
    raw: true,
  });

  // Turn the ledger into patient data for the UPDATE calls that we'll do lower down
  const patientsLastProcedureData = await Promise.all(ledgerByPatient.map(({ patientId, maxDate }) =>
    fetchBookedApptNearDate({
      accountId,
      patientId,
      date: maxDate,
      numHoursNearDate,
    }).then(([appointment]) => ({
      id: patientId,
      [procedureAttr]: maxDate,
      [procedureApptAttr]: appointment ? appointment.id : null,
    }))
  ));

  // If we are updating ALL the patients for an account
  // then update everyone's lastProcedureDate that didnt get returned above to null
  const patientsLastProcedureIds = patientsLastProcedureData.map(p => p.id);
  let nullUpdateIdsQuery = { $notIn: patientsLastProcedureIds };
  if (patientIds) {
    // If we are only updating a small subset of patients,
    // set the ones that are no longer due to null
    nullUpdateIdsQuery = { $in: difference(patientIds, patientsLastProcedureIds) };
  }

  await Patient.update({
    [procedureAttr]: null,
    [procedureApptAttr]: null,
  }, {
    where: {
      id: nullUpdateIdsQuery,
      accountId,
    },
  });

  // Wrap the update calls in a Promise.all for performance so we aren't waiting for one-by-one
  const patientsLastProcedureUpdates = patientsLastProcedureData.map((data) =>
    Patient.update(
      { [procedureAttr]: data[procedureAttr], [procedureApptAttr]: data[procedureApptAttr] },
      { where: { id: data.id } },
    ).catch((err) => {
      logger.error(
        `Failed updating ${procedureAttr}=${data[procedureAttr]} ` +
        `and ${procedureApptAttr}=${data[procedureApptAttr]} ` +
        `for patient with id=${data.id}`,
      );

      logger.error(err);
    })
  );

  return Promise.all(patientsLastProcedureUpdates);
}

/**
 * fetchBookedApptNearDate is a function that returns a promise that fetches a booked appointment
 * for a patient and an account that is near a date based on a supplied number of hours near that date
 *
 * @param date
 * @param accountId
 * @param patientId
 * @param numHoursNearDate
 * @return [appointment]
 */
function fetchBookedApptNearDate({ date, accountId, patientId, numHoursNearDate }) {
  return Appointment.findAll({
    where: {
      accountId,
      patientId,
      ...Appointments.getCommonSearchAppointmentSchema(),
      startDate: {
        $gte: moment(date).subtract(numHoursNearDate, 'hours').toISOString(),
        $lte: moment(date).add(numHoursNearDate, 'hours').toISOString(),
      },
    },

    limit: 1,
  });
}

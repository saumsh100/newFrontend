
import isArray from 'lodash/isArray';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';
import groupPatientsByChannelPoc from '../contactInfo/groupPatientsByChannelPoc';

const selectAppointment = appts => orderBy(appts, 'startDate')[0];

/**
 * flattenFamilyAppointments is a function that will injest data about appointments
 * and patients and their family and return the appointments that need to get added
 * to the appointments needing reminders because it needs to go out together
 *
 * @param appointment - appointment data with joined patient > family > patients > appointments
 * @param reminder - the reminder touchpoint in question
 * @param customApptsAttr - the attribute where the appts are found on the family's joined patient models
 * @return [appointments]
 */
export default function flattenFamilyAppointments({ appointment, reminder, customApptsAttr = 'appointments' }) {
  let flattenedAppointments = [appointment];
  const originalPatient = appointment.patient;
  const { family } = originalPatient;
  if (!family || !isArray(family.patients)) return flattenedAppointments;

  const { primaryTypes } = reminder;

  // Need to add family to the patient models so that contactInfo library can work
  family.patients = family.patients.map(p => ({ ...p, family }));

  // For every channel:
  // - Group patients in family by that channels PoC
  // - If the originalPatient is the head or the dependants, then grab all of those appointments and return
  primaryTypes.forEach((channel) => {
    const { success } = groupPatientsByChannelPoc({
      channel,
      patients: family.patients,
      fetchedPatients: family.patients,
    });

    // Find the group that belongs to the original patient
    const { patient, dependants } = success.find((group =>
      group.patient.id === originalPatient.id ||
      group.dependants.some(p => originalPatient.id === p.id)
    ));

    // Now grab the earliest appointment for all patients in that group
    let extra = [];
    if (originalPatient.id === patient.id) {
      extra = dependants.reduce((arr, p) => {
        const appointments = p[customApptsAttr];
        return appointments && appointments.length ? [
          ...arr,
          selectAppointment(appointments),
        ] : arr;
      }, extra);
    } else if (dependants.some(p => originalPatient.id === p.id)) {
      extra.push(selectAppointment(patient[customApptsAttr]));
      extra = dependants.reduce((arr, p) => {
        const appointments = p[customApptsAttr];
        return appointments && appointments.length && originalPatient.id !== patient.id ? [
          ...arr,
          selectAppointment(appointments),
        ] : arr;
      }, extra);
    }

    // Remove undefined values
    extra = extra.filter(a => a);
    flattenedAppointments = [...flattenedAppointments, ...extra];
  });

  return uniqBy(flattenedAppointments, a => a.id);
}

export function orderAppointmentsForSamePatient(appointments) {
  return Object.values(groupBy(appointments, 'patientId'))
    .reduce((orderedAppointments, group) => {
      return [
        ...orderedAppointments,
        ...orderBy(group, 'startDate', 'desc'),
      ];
    }, []);
}

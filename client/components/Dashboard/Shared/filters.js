
import moment from 'moment';

export const FilterAppointments = (appointments, practitioners, date) =>
  appointments.filter((app) => {
    const sDate = moment(app.startDate);
    const isSameDate =
      date.isSame(sDate, 'day') && date.isSame(sDate, 'month') && date.isSame(sDate, 'year');
    const activePractitioner = practitioners
      .toArray()
      .map(({ id }) => id)
      .includes(app.practitionerId);

    return (
      activePractitioner &&
      isSameDate &&
      !app.isDeleted &&
      !app.isCancelled &&
      !app.mark &&
      !app.isPending
    );
  });

export const FilterPatients = (patients, ids) =>
  patients.filter(patient => ids.indexOf(patient.get('id')) > -1 && !patient.get('isDeleted'));

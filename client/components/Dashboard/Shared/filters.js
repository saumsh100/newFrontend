
import moment from 'moment';

export const FilterAppointments = (appointments, date) => {
  return appointments.filter((app) => {
    const sDate = moment(app.startDate);
    const isSameDate = (date.isSame(sDate, 'day') && date.isSame(sDate, 'month') && date.isSame(sDate, 'year'))
    return (isSameDate && !app.isDeleted && !app.isCancelled && !app.mark);
  });
};

export const FilterPatients = (patients, ids) => {
  return patients.filter((patient) => {
    return ((ids.indexOf(patient.get('id')) > -1) && !patient.get('isDeleted'));
  });
}

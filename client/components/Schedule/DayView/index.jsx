
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DayViewBody from './DayViewBody';

class DayView extends Component  {
  render() {
    const {
      currentDate,
      practitioners,
      patients,
      appointments,
      services,
      chairs,
      schedule,
      selectAppointment,
      leftColumnWidth,
    } = this.props;

    const filteredAppointments = appointments.get('models').toArray().filter((app) => {
      const startDate = moment(app.startDate);
      const isSameDate = startDate.isSame(currentDate, 'day');
      return (!app.isDeleted && isSameDate && !app.isCancelled);
    });

    return (
      <DayViewBody
        schedule={schedule}
        selectAppointment={selectAppointment}
        appointments={filteredAppointments}
        chairs={chairs.get('models')}
        services={services.get('models')}
        patients={patients.get('models')}
        practitioners={practitioners}
        startHour={6}
        endHour={24}
        leftColumnWidth={leftColumnWidth}
      />
    );
  }

}

DayView.propTypes = {
  appointments: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  chairs: PropTypes.object.isRequired,
  practitioners: PropTypes.object.isRequired,
  currentDate: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
  selectAppointment: PropTypes.func.isRequired,
  leftColumnWidth: PropTypes.number,
};

export default DayView;


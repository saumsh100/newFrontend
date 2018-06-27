
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DayViewBody from './DayViewBody';

class DayView extends Component {
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

    const pracColumns = {};
    const chairColumns = {};

    const filteredAppointments = appointments
      .get('models')
      .toArray()
      .filter((app) => {
        const startDate = moment(app.startDate);
        const isSameDate = startDate.isSame(currentDate, 'day');

        if (
          !app.isDeleted &&
          isSameDate &&
          !app.isCancelled &&
          !app.isPending
        ) {
          pracColumns[app.practitionerId] = true;
          chairColumns[app.chairId] = true;
          return app;
        }
      });

    const filteredChairs = filteredAppointments.length
      ? chairs.get('models').filter(ch => chairColumns[ch.id])
      : chairs.get('models');

    const filteredPracs = filteredAppointments.length
      ? practitioners.filter(prac => pracColumns[prac.id])
      : practitioners;

    return (
      <DayViewBody
        schedule={schedule}
        selectAppointment={selectAppointment}
        appointments={filteredAppointments}
        chairs={filteredChairs}
        services={services.get('models')}
        patients={patients.get('models')}
        practitioners={filteredPracs}
        startHour={4}
        endHour={23}
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


import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DayViewBody from './DayViewBody';

class DayView extends Component  {
  constructor(props) {
    super(props);
  }

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
    } = this.props;

    const filteredAppointments= appointments.get('models').toArray().filter((app) => {
      const startDate = moment(app.startDate);
      const isSameDate = startDate.isSame(currentDate, 'day');

      if (!app.isDeleted && isSameDate) {
        return app;
      }
    });

    return (
      <DayViewBody
        schedule={schedule}
        selectAppointment={selectAppointment}
        appointments={filteredAppointments}
        chairs={chairs.get('models')}
        services={services.get('models')}
        patients={patients.get('models')}
        practitioners={practitioners.get('models')}
        startHour={6}
        endHour={24}
      />
    );
  }

}

export default DayView;

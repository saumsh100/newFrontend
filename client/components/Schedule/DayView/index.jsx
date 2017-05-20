
import React, { Component, PropTypes } from 'react';
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


    return (
      <DayViewBody
        schedule={schedule}
        currentDate={currentDate}
        selectAppointment={selectAppointment}
        appointments={appointments.get('models')}
        chairs={chairs.get('models')}
        services={services.get('models')}
        patients={patients.get('models')}
        practitioners={practitioners.get('models')}
        startHour={0}
        endHour={24}
      />
    );
  }

}

export default DayView;

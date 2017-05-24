
import React, { Component, PropTypes } from 'react';
import ShowAppointment from './ShowAppointment';
import TimeSlotColumn from './TimeSlotColumn';

class TimeSlot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      practitioner,
      timeSlots,
      timeSlotHeight,
      startHour,
      endHour,
      patients,
      appointments,
      services,
      chairs,
      selectAppointment,
      columnWidth,
      practIndex,
    } = this.props;

    const filteredApps = appointments.filter((app) => {
      return app.practitionerId === practitioner.toJS().id;
    }).map((app) => {
      const service = services.get(app.get('serviceId'));
      const patient = patients.get(app.get('patientId'));
      const chair = chairs.get(app.get('chairId'));

      return Object.assign({}, app.toJS(), {
        appModel: app,
        serviceData: service.get('name'),
        chairData: chair.get('name'),
        patientData: patient,
      });
    });
    const colorArray = [ '#FF715A', '#FFC45A', '#2CC4A7', '#8CBCD6' ];

    const timeSlotContentStyle = {
      width: `${columnWidth}%`,
      boxSizing: 'border-box',
    };

    return (
      <div style={timeSlotContentStyle}>
        <TimeSlotColumn
          key={`column_${practIndex}`}
          index={practIndex}
          timeSlots={timeSlots}
          timeSlotHeight={timeSlotHeight}
          columnWidth={columnWidth}
        />
        {filteredApps.map((app, index) => {
          return (
            <ShowAppointment
              key={index}
              practIndex={practIndex}
              appointment={app}
              bgColor={colorArray[practIndex]}
              selectAppointment={selectAppointment}
              startHour={startHour}
              endHour={endHour}
              columnWidth={columnWidth}
            />
          );
        })}
      </div>
    );
  }
}

TimeSlot.PropTypes = {
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  appointments: PropTypes.object,
  patients: PropTypes.object,
  services: PropTypes.object,
  chairs: PropTypes.object,
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  practitioner: PropTypes.object,
  selectAppointment: PropTypes.func.isRequired,
};

export default TimeSlot;

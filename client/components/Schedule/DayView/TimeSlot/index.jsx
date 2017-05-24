
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

    return (
      <div style={{ width: `${columnWidth}%`, boxSizing: 'border-box'}}>
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

export default TimeSlot;

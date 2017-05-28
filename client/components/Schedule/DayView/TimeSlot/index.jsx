
import React, { Component, PropTypes } from 'react';
import ShowAppointment from './ShowAppointment';
import TimeSlotColumn from './TimeSlotColumn';
import moment from 'moment';

function checkOverLapping(appointments, startDate, endDate) {
  return appointments.filter((app)=>{
    if((moment(startDate).isSame(moment(app.startDate))) ||
      (moment(startDate).isBetween(moment(app.startDate), moment(app.endDate))) ||
      (moment(endDate).isSame(moment(app.endDate))) ||
      (moment(endDate).isBetween(moment(app.startDate), moment(app.endDate)))) {
      return app;
    };
  });
}
export default function TimeSlot(props) {
  const {
    practitioner,
    timeSlots,
    timeSlotHeight,
    startHour,
    endHour,
    schedule,
    patients,
    appointments,
    services,
    chairs,
    selectAppointment,
    columnWidth,
    practIndex,
  } = props;

  const checkFilters = schedule.toJS();

  const filteredApps = appointments.filter((app) => {

    const service = services.get(app.get('serviceId'));
    const chair = chairs.get(app.get('chairId'));
    const servicesFilter = service && checkFilters.servicesFilter.indexOf(service.get('id')) > -1;
    const chairsFilter = chair && checkFilters.chairsFilter.indexOf(chair.get('id')) > -1;

    return ((app.practitionerId === practitioner.id) && chairsFilter && servicesFilter);
  }).map((app) => {
    return Object.assign({}, app.toJS(), {
      appModel: app,
      serviceData: services.get(app.get('serviceId')).get('name') || '',
      chairData: chairs.get(app.get('chairId')).get('name') || '',
      patientData: patients.get(app.get('patientId')) || '',
    });
  });

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
      {filteredApps && filteredApps.map((app, index) => {
        return (
          <ShowAppointment
            key={index}
            practIndex={practIndex}
            appointment={app}
            bgColor={practitioner.color}
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

TimeSlot.PropTypes = {
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  practIndex: PropTypes.number,
  columnWidth: PropTypes.number,
  appointments: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  chairs: PropTypes.object.isRequired,
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  practitioner: PropTypes.object.isRequired,
  selectAppointment: PropTypes.func.isRequired,
};


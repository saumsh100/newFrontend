
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import ShowAppointment from './ShowAppointment';
import TimeSlotColumn from './TimeSlotColumn';


function intersectingAppointments(appointments, startDate, endDate) {
  const sDate = moment(startDate);
  const eDate = moment(endDate);

  return appointments.filter((app) => {
    const appStartDate = moment(app.startDate);
    const appEndDate = moment(app.endDate);
    if (sDate.isSame(appStartDate) || sDate.isBetween(appStartDate, appEndDate) ||
      eDate.isSame(appEndDate) || eDate.isBetween(appStartDate, appEndDate)) {
      return app;
    };
  });
}
const sortApps = (a, b) => {
  const aMoment = moment(a.startDate);
  const bMoment = moment(b.startDate);
  if (aMoment.isBefore(bMoment)) return -1;
  if (aMoment.isAfter(bMoment)) return 1;
  return 0;
};

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

  // filter appointments based on selections from the filters panel
  const checkFilters = schedule.toJS();

  let filteredApps = appointments.filter((app) => {
    const service = services.get(app.get('serviceId'));
    const chair = chairs.get(app.get('chairId'));
    const servicesFilter = service && checkFilters.servicesFilter.indexOf(service.get('id')) > -1;
    const chairsFilter = chair && checkFilters.chairsFilter.indexOf(chair.get('id')) > -1;

    return ((app.practitionerId === practitioner.id) && chairsFilter && servicesFilter );
  }).map((app) => {
    return Object.assign({}, app.toJS(), {
      appModel: app,
      serviceData: services.get(app.get('serviceId')).get('name'),
      chairData: chairs.get(app.get('chairId')).get('name'),
      patientData: patients.get(app.get('patientId')),
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
      {filteredApps && filteredApps.map((app, index, array) => {

        //const notWithThisApp = filteredApps.filter((sameApp) => !(sameApp.id === app.id))
        const widthSplit = intersectingAppointments(array, app.startDate, app.endDate)

        const row = moment(app.startDate).hour() ;
        const rowFilter = widthSplit.filter((w) => moment(w.startDate).hour() === row)
        const testSort = rowFilter.sort(sortApps);

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
            widthIntersect={widthSplit.length}
            thisIndex={index}
            testSort={testSort}
          />
        );
      })}
    </div>
  );
}

TimeSlot.propTypes = {
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  practIndex: PropTypes.number,
  columnWidth: PropTypes.number,
  appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
  schedule: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  chairs: PropTypes.object.isRequired,
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  practitioner: PropTypes.object.isRequired,
  selectAppointment: PropTypes.func.isRequired,
};


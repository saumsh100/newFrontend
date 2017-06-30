import React, { Component, PropTypes } from 'react';
import TimeSlot from '../TimeSlot';
import styles from '../styles.scss';

export default function ChairsSlot(props) {
  const {
    timeSlots,
    timeSlotHeight,
    startHour,
    endHour,
    schedule,
    practitioners,
    practitionersArray,
    chairsArray,
    patients,
    appointments,
    services,
    selectAppointment,
  } = props;

  return (
    <div className={styles.dayView_body_timeSlot} >
      {chairsArray.length ? chairsArray.map((chair, i, arr) => {
        const columnWidth = 100 / arr.length;

        const checkFilters = schedule.toJS();

        const filteredApps = appointments.filter((app) => {
          const service = services.get(app.get('serviceId'));
          const practitioner = practitioners.get(app.get('practitionerId'));
          const servicesFilter = service && checkFilters.servicesFilter.indexOf(service.get('id')) > -1;
          const practitionersFilter = practitioner && checkFilters.practitionersFilter.indexOf(practitioner.get('id')) > -1;
          return ((app.chairId === chair.id) && practitionersFilter && servicesFilter );
        }).map((app) => {
          const practitionerData = practitionersArray.find(prac=> prac.id === app.get('practitionerId'));

          return Object.assign({}, app.toJS(), {
            appModel: app,
            serviceData: services.get(app.get('serviceId')).get('name'),
            chairData: chair.name,
            practitionerData,
            patientData: patients.get(app.get('patientId')),
          });
        });

        return (
          <TimeSlot
            key={i}
            timeSlots={timeSlots}
            timeSlotHeight={timeSlotHeight}
            practIndex={i}
            columnWidth={columnWidth}
            startHour={startHour}
            endHour={endHour}
            filteredApps={filteredApps}
            selectAppointment={selectAppointment}
            scheduleView={schedule.toJS().scheduleView}
            columnHeaderName={chair.name}
          />
        );
      }) : null}
    </div>
  );
}

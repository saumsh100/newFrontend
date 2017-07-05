
import React, { Component, PropTypes } from 'react';
import TimeSlot from '../TimeSlot';
import styles from '../styles.scss';


export default function PractitionersSlot(props) {
  const {
    timeSlots,
    timeSlotHeight,
    startHour,
    endHour,
    schedule,
    practitionersArray,
    patients,
    appointments,
    services,
    chairs,
    selectAppointment,
  } = props;

  return (
    <div className={styles.dayView_body_timeSlot} >
      {practitionersArray.length ? practitionersArray.map((pract, i, arr) => {
        const columnWidth = 100 / arr.length;

        const checkFilters = schedule.toJS();

        const filteredApps = appointments.filter((app) => {
          if (app.get('mark') && (app.practitionerId === pract.id)) {
            return app;
          }

          const service = services.get(app.get('serviceId'));
          const chair = chairs.get(app.get('chairId'));
          const servicesFilter = service && checkFilters.servicesFilter.indexOf(service.get('id')) > -1;
          const chairsFilter = chair && checkFilters.chairsFilter.indexOf(chair.get('id')) > -1;

          return ((app.practitionerId === pract.id) && chairsFilter && servicesFilter);
        }).map((app) => {
          if (app.get('mark')) {
            return app;
          }

          return Object.assign({}, app.toJS(), {
            appModel: app,
            serviceData: services.get(app.get('serviceId')).get('name'),
            chairData: chairs.get(app.get('chairId')).get('name'),
            patientData: patients.get(app.get('patientId')),
            practitionerData: pract,
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
            columnHeaderName={pract.prettyName}
          />
        );
      }) : null}
    </div>
  );
}

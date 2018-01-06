import React, { Component, PropTypes } from 'react';
import TimeSlot from '../TimeSlot';
import ColumnHeader from '../ColumnHeader/index';
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
    scrollComponentDidMountChair,
  } = props;

  return (
    <div className={styles.timeSlot} ref={scrollComponentDidMountChair}>
      {chairsArray.length ? chairsArray.map((chair, i, arr) => {
        const columnWidth = arr.length < 5 ? 100 / arr.length : 30;


        const checkFilters = schedule.toJS();

        const filteredApps = appointments.filter((app) => {
          if (app.get('mark') && (app.chairId === chair.id)) {
            return app;
          }

          const practitioner = practitioners.get(app.get('practitionerId'));
          const practitionersFilter = practitioner && checkFilters.practitionersFilter.indexOf(practitioner.get('id')) > -1;

          return ((app.chairId === chair.id) && practitionersFilter);
        }).map((app) => {
          if (app.get('mark')) {
            return app;
          }

          const practitionerData = practitionersArray.find(prac=> prac.id === app.get('practitionerId'));

          return Object.assign({}, app.toJS(), {
            appModel: app,
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
            minWidth={schedule.toJS().columnWidth}
            startHour={startHour}
            endHour={endHour}
            filteredApps={filteredApps}
            selectAppointment={selectAppointment}
            scheduleView={schedule.toJS().scheduleView}
            entity={chair}
          />
        );
      }) : null}
    </div>
  );
}


ChairsSlot.propTypes = {
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  appointments: PropTypes.arrayOf(PropTypes.object),
  patients: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  chairs: PropTypes.object.isRequired,
  practitioners: PropTypes.object.isRequired,
  schedule: PropTypes.object,
  selectAppointment: PropTypes.func.isRequired,
  scheduleView: PropTypes.string.isRequired,
  leftColumnWidth: PropTypes.number,
  practitionersArray: PropTypes.array,
  chairsArray: PropTypes.array,
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  scrollComponentDidMountChair: PropTypes.func,
};

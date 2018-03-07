
import React, { Component, PropTypes } from 'react';
import TimeSlot from '../TimeSlot';
import ColumnHeader from '../ColumnHeader/index';
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
    chairs,
    selectAppointment,
    scrollComponentDidMount,
  } = props;

  return (
    <div className={styles.scrollDiv} ref={scrollComponentDidMount}>
      <div className={styles.timeSlot}>
        {practitionersArray.length ? practitionersArray.map((pract, i, arr) => {
          const checkFilters = schedule.toJS();

          const filteredApps = appointments.filter((app) => {
            if (app.get('mark') && (app.practitionerId === pract.id)) {
              return app;
            }

            const chair = chairs.get(app.get('chairId'));
            const chairsFilter = chair && checkFilters.chairsFilter.indexOf(chair.get('id')) > -1;

            return ((app.practitionerId === pract.id) && chairsFilter);
          }).map((app) => {
            if (app.get('mark')) {
              return app;
            }

            return Object.assign({}, app.toJS(), {
              appModel: app,
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
              startHour={startHour}
              endHour={endHour}
              filteredApps={filteredApps}
              selectAppointment={selectAppointment}
              scheduleView={schedule.toJS().scheduleView}
              minWidth={schedule.toJS().columnWidth}
              selectedAppointment={schedule.toJS().selectedAppointment}
              numOfColumns={practitionersArray.length}
              columnIndex={i}
              unit={schedule.toJS().appointmentMinUnit}
            />
          );
        }) : null}
      </div>
    </div>
  );
}

PractitionersSlot.propTypes = {
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  appointments: PropTypes.arrayOf(PropTypes.object),
  patients: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  chairs: PropTypes.object.isRequired,
  practitioners: PropTypes.object,
  schedule: PropTypes.object,
  selectAppointment: PropTypes.func.isRequired,
  scheduleView: PropTypes.string.isRequired,
  leftColumnWidth: PropTypes.number,
  practitionersArray: PropTypes.array,
  chairsArray: PropTypes.array,
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  scrollComponentDidMount: PropTypes.func,
};

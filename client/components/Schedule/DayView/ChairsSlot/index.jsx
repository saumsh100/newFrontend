import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import TimeSlot from '../TimeSlot';
import Appointment from '../../../../entities/models/Appointments';
import Event from '../../../../entities/models/Event';
import { practitionerShape } from '../../../library/PropTypeShapes';
import Chair from '../../../../entities/models/Chair';
import styles from '../styles.scss';

export default function ChairsSlot(props) {
  const {
    timeSlots,
    timeSlotHeight,
    startHour,
    endHour,
    schedule,
    practitioners,
    events,
    practitionersArray,
    chairsArray,
    patients,
    appointments,
    selectAppointment,
    scrollComponentDidMountChair,
    timezone,
  } = props;
  const filteredPractitionerIds = schedule.get('practitionersFilter');

  return (
    <div className={styles.scrollDiv} ref={scrollComponentDidMountChair}>
      <div className={styles.timeSlot}>
        {chairsArray.length > 0 &&
          chairsArray.map((chair, i) => {
            const filteredAppointments = appointments
              .filter((app) => {
                if (app.get('mark') && app.chairId === chair.id) {
                  return app;
                }

                const practitioner = practitioners.get(app.get('practitionerId'));
                const practitionersFilter =
                  practitioner && filteredPractitionerIds.indexOf(practitioner.get('id')) > -1;

                return app.chairId === chair.id && practitionersFilter;
              })
              .map((app) => {
                if (app.get('mark')) {
                  return app;
                }

                const practitionerData = practitionersArray.find(
                  (prac) => prac.id === app.get('practitionerId'),
                );

                return {
                  ...app.toJS(),
                  appModel: app,
                  chairData: chair.name,
                  practitionerData,
                  patientData: patients.get(app.get('patientId')),
                };
              });

            return (
              <TimeSlot
                key={`timeSlotKey_${chair.id}`}
                entityId={chair.id}
                timeSlots={timeSlots}
                timeSlotHeight={timeSlotHeight}
                practIndex={i}
                minWidth={schedule.get('columnWidth')}
                startHour={startHour}
                endHour={endHour}
                items={filteredAppointments.concat(events.filter((e) => e.chairId === chair.id))}
                selectAppointment={selectAppointment}
                scheduleView={schedule.get('scheduleView')}
                selectedAppointment={schedule.get('selectedAppointment')}
                numOfColumns={chairsArray.length}
                columnIndex={i}
                unit={schedule.get('appointmentMinUnit')}
                timezone={timezone}
              />
            );
          })}
      </div>
    </div>
  );
}

ChairsSlot.propTypes = {
  startHour: PropTypes.number.isRequired,
  endHour: PropTypes.number.isRequired,
  appointments: PropTypes.arrayOf(PropTypes.instanceOf(Appointment)).isRequired,
  events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
  patients: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  schedule: PropTypes.instanceOf(Map).isRequired,
  selectAppointment: PropTypes.func.isRequired,
  practitionersArray: PropTypes.arrayOf(PropTypes.shape(practitionerShape)).isRequired,
  chairsArray: PropTypes.arrayOf(PropTypes.instanceOf(Chair)).isRequired,
  timeSlots: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.number,
    }),
  ).isRequired,
  timeSlotHeight: PropTypes.shape({
    height: PropTypes.number,
  }).isRequired,
  scrollComponentDidMountChair: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

ChairsSlot.defaultProps = {};

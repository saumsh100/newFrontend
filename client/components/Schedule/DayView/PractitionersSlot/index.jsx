
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import TimeSlot from '../TimeSlot';
import Appointment from '../../../../entities/models/Appointments';
import Event from '../../../../entities/models/Event';
import { practitionerShape } from '../../../library/PropTypeShapes';
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
    events,
    chairs,
    selectAppointment,
    scrollComponentDidMount,
  } = props;

  const filteredChairIds = schedule.get('chairsFilter');

  return (
    <div className={styles.scrollDiv} ref={scrollComponentDidMount}>
      <div className={styles.timeSlot}>
        {practitionersArray.length &&
          practitionersArray.map((pract, i) => {
            const filteredApps = appointments
              .filter((app) => {
                if (app.get('mark') && app.practitionerId === pract.id) {
                  return app;
                }

                const chair = chairs.get(app.get('chairId'));
                const chairsFilter = chair && filteredChairIds.indexOf(chair.get('id')) > -1;

                return app.practitionerId === pract.id && chairsFilter;
              })
              .map((app) => {
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
                key={`practitionerTimeSlots_${pract.id}`}
                entityId={pract.id}
                timeSlots={timeSlots}
                timeSlotHeight={timeSlotHeight}
                startHour={startHour}
                endHour={endHour}
                items={filteredApps.concat(events.filter(e => e.practitionerId === pract.id))}
                selectAppointment={selectAppointment}
                scheduleView={schedule.get('scheduleView')}
                minWidth={schedule.get('columnWidth')}
                selectedAppointment={schedule.get('selectedAppointment')}
                numOfColumns={practitionersArray.length}
                columnIndex={i}
                unit={schedule.get('appointmentMinUnit')}
              />
            );
          })}
      </div>
    </div>
  );
}

PractitionersSlot.propTypes = {
  startHour: PropTypes.number.isRequired,
  endHour: PropTypes.number.isRequired,
  appointments: PropTypes.arrayOf(PropTypes.instanceOf(Appointment)).isRequired,
  events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
  patients: PropTypes.instanceOf(Map).isRequired,
  schedule: PropTypes.instanceOf(Map).isRequired,
  selectAppointment: PropTypes.func.isRequired,
  practitionersArray: PropTypes.arrayOf(PropTypes.shape(practitionerShape)).isRequired,
  chairs: PropTypes.instanceOf(Map).isRequired,
  timeSlots: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.number,
    }),
  ).isRequired,
  timeSlotHeight: PropTypes.shape({
    height: PropTypes.number,
  }).isRequired,
  scrollComponentDidMount: PropTypes.func.isRequired,
};

PractitionersSlot.defaultProps = {};

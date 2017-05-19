
import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import TimeColumns from './TimeColumns';
import PractitionerSchedule from './PractitionerSchedule';
import styles from '../styles.scss';

function DayView(props) {
  const {
    patients,
    appointments,
    schedule,
    currentDate,
    practitioners,
    selectAppointment
  } = props;
  const start = currentDate.hour(0).minute(0);
  const end = moment({ hour: 23, minute: 59 });
  const workingMinutes = end.diff(start, 'minutes');
  const startHours = start.get('hours');
  const endHours = end.get('hours');
  const workingHours = [];
  for (let i = startHours; i <= endHours; i += 1) {
    workingHours.push(i);
  }

  let practitionersArray = practitioners.get('models').toArray();
  const checkedPractitioners = schedule.toJS().practitionersFilter;
  if (checkedPractitioners.length) {
    practitionersArray = practitionersArray.filter(pr => checkedPractitioners.indexOf(pr.id) > -1);
  }
  const tablesCount = (100 / (practitionersArray.length + 1)) ;
  const scale = 1.5;

  return (
    <div className={styles.schedule}>
      <TimeColumns
        workingHours={workingHours}
        scale={scale}
        tablesCount={tablesCount}
        totalColumns={practitionersArray.length + 1}
      />
      {practitionersArray.map((prac,index) => (
        <PractitionerSchedule
          key={index}
          doctor={prac}
          startDay={start}
          workingHours={workingHours}
          scale={scale}
          tablesCount={tablesCount}
          divIndex={index}
          patients={patients}
          appointments={appointments}
          schedule={schedule}
          currentDate={currentDate}
          selectAppointment={selectAppointment}
        />
      ))}
    </div>
  );
}

DayView.PropTypes = {
  fetchEntities: PropTypes.func,
  patients: PropTypes.object,
  appointments: PropTypes.object,
  schedule: PropTypes.object,
  currentDate: PropTypes.object,
};

export default DayView;


import React, { PropTypes } from 'react';
import moment from 'moment';
import DisplayAppointment from './DisplayAppointment';
import { setTime } from '../../library/util/TimeOptions';
import styles from '../styles.scss';

const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

export default function PractitionerSchedule(props) {
  const {
    doctor,
    workingHours,
    scale,
    startDay,
    tablesCount,
    divIndex,
    patients,
    appointments,
    schedule,
    currentDate,
    selectAppointment,
  } = props;

  const patientsArray = patients.get('models').toArray();

  const appointmentsArray = appointments.get('models').toArray().filter((app) => !app.isDeleted);

  let apps = appointmentsArray.length && appointmentsArray
      .filter((app) => {
        const currentDoctorsAppointment = app.practitionerId === doctor.id;
        const momentDate = currentDate;
        const momentStartTime = moment(app.startDate);
        const theSameDay = momentDate.date() === momentStartTime.date();
        const theSameMonth = momentDate.month() === momentStartTime.month();
        const theSameYear = momentDate.year() === momentStartTime.year();
        const theSameDate = theSameDay && theSameMonth && theSameYear;
        return currentDoctorsAppointment && theSameDate;
      })
      .map((app) => {
        const { note, startDate, endDate, practitionerId, customBufferTime } = app;

        const patient = patientsArray.filter(pt => pt.id === app.patientId)[0];
        const patientName = patient && `${patient.firstName} ${patient.lastName}`;

        const addPatient = Object.assign({}, patient.toJS(), {
          patientData: patient.toJS(),
          note: app.note,
        });

        const durationTime = getDuration(startDate, endDate, customBufferTime);
        const bufferTime = customBufferTime ? durationTime + customBufferTime : durationTime;

        const addToApp = Object.assign({}, app.toJS(), {
          appModel: app,
          time: setTime(startDate),
          date: moment(startDate).format('L'),
          duration: [durationTime, bufferTime],
        });

        const appObject = {
          app: addToApp,
          patient: addPatient,
          title: note,
          startTime: moment(startDate),
          endTime: moment(endDate),
          practitionerId,
        };

        return Object.assign({}, appObject, { name: patientName });
      });

  const doctorAppointments = apps.filter(app => app.practitionerId === doctor.id);
  const doctorScheduleColumn = {
    display: 'inline-block',
    position: 'relative',
    width: `${tablesCount}%`,
  };
  const workingHour = {
    height: `${scale * 60}px`,
    color: 'white',
  };

  return (
    <div key={divIndex} className={styles.schedule__body} style={doctorScheduleColumn}>
      {workingHours.map((h, i) => (
        <div key={i} className={styles.schedule__element} style={workingHour}>
          {h}
        </div>
      ))}
      {doctorAppointments.map((app, i) => {
        return (
          <DisplayAppointment
            key={i}
            appointment={app}
            scale={scale}
            startDay={startDay}
            index={i}
            selectAppointment={selectAppointment}
          />
        );
      })}
    </div>
  );
}



import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import {fetchEntities} from '../../../thunks/fetchEntities';
import Link from '../../library/Link';
import CurrentDate from '../Cards/CurrentDate';
import styles from '../styles.scss';
import { setTime } from '../../library/util/TimeOptions';


const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

class DayView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderDoctorsSchedule = this.renderDoctorsSchedule.bind(this);
    this.renderTimeColumn = this.renderTimeColumn.bind(this);
  }

  renderAppoinment(appointment, scale, startDay, index) {
    const { selectAppointment } = this.props;

    const start = appointment.startTime;
    const end = appointment.endTime;
    const minutesDuration = end.diff(start, 'minutes');
    const positionTop = start.diff(startDay, 'minutes') * scale ;
    const appointmentStyles = {
      height: `${minutesDuration * scale}px`,
      top: `${positionTop}px`,
      cursor: 'pointer',
    };
    const format = 'MMMM Do YYYY, h:mm:ss a';
    const displayStartDate = appointment.startTime.format(format);
    const displayEndDate = appointment.endTime.format(format);
    return (
      <div key={index} className={styles.appointment} style={appointmentStyles}
           onClick={()=>{
            selectAppointment({
                appointment: appointment.app,
                patient: appointment.patient
              })
           }}>
          <div className={styles.appointment__username}>{appointment.name}</div>
          <div className={styles.appointment__date}>{`${displayStartDate} - ${displayEndDate}`}</div>
          <div className={styles.appointment__title}>{appointment.title}</div>
      </div>
    );
  }

  renderDoctorsSchedule(doctor, workingHours, scale, startDay, tablesCount, divIndex) {
    const { patients, appointments, schedule, currentDate } = this.props;
    const patientsArray = patients.get('models').toArray();
    const appointmentsArray = appointments.get('models').toArray();
    const appointmentType = schedule.toJS().appointmentType;
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
            note: app.note
          });

          const durationTime = getDuration(startDate, endDate, customBufferTime);
          const bufferTime = customBufferTime ? durationTime + customBufferTime : durationTime
          const addToApp = Object.assign({}, app.toJS(), {
            appModel: app,
            time: setTime(startDate),
            date: moment(startDate).format('L'),
            duration: [durationTime, bufferTime]
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

    if (appointmentType) {
      apps = apps.filter(app => app.title === appointmentType);
    }
    if (typeof apps !== 'object') apps = [];

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
        {doctorAppointments.map((app, i) => this.renderAppoinment(app, scale, startDay, i))}
      </div>
    );
  }
  renderTimeColumn(workingHours, workingMinutes, scale, tablesCount) {
    const workingHoursColumn = {
      width: `${tablesCount / 2}%`,
      display: 'inline-block',
    };
    const workingHour = {
      height: `${scale * 60}px`,
    };
    return (
      <div className={styles.schedule__header} style={workingHoursColumn}>
        {workingHours.map((h, i) => (
          <div key={i} className={styles.schedule__element} style={workingHour}>
            <div className={styles.schedule__date}>
              {moment({ hour: h, minute: 0 }).format('h:mm a')}
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const {
      practitioners,
      patients,
      appointments,
      schedule,
      currentDate,
    } = this.props;
    //const start = moment({ hour: 0, minute: 0 });
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
    const checkedPractitioers = schedule.toJS().practitionersFilter;
    if (checkedPractitioers.length) {
      practitionersArray = practitionersArray.filter(pr => checkedPractitioers.indexOf(pr.id) > -1);
    }
    const tablesCount = (100 / (practitionersArray.length + 1));
    const scale = 1.2;
    return (
      <div className={styles.schedule}>
          {this.renderTimeColumn(workingHours, workingMinutes, scale, tablesCount)}
          {practitionersArray.map((d,index) => (
              this.renderDoctorsSchedule(d, workingHours, scale, start, tablesCount, index)
          ))}
      </div>
    );
  }
}

DayView.PropTypes = {
  fetchEntities: PropTypes.func,
  patients: PropTypes.object,
  appointments: PropTypes.object,
  schedule: PropTypes.object,
  currentDate: PropTypes.object,
};

export default DayView;

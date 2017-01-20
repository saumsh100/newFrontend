import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import {fetchEntities} from '../../../thunks/fetchEntities';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './index.css'
import Link from '../../library/Link';

class SelectedDay extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.renderDoctrosSchedule = this.renderDoctrosSchedule.bind(this);
        this.renderTimeColumn = this.renderTimeColumn.bind(this);
    }

    componentDidMount() {
        this.props.fetchEntities({key: 'appointments'});
        this.props.fetchEntities({ key: 'practitioners' });
        this.props.fetchEntities({ key: 'patients' });
    }

    renderAppoinment(appointment, scale, startDay) {
        const start = appointment.startTime;
        const end = appointment.endTime;
        const minutesDuration = end.diff(start, 'minutes');
        const positionTop = start.diff(startDay, 'minutes') * scale;
        const appointmentStyles = {
            height: `${minutesDuration * scale}px`,
            top: `${positionTop}px`,
        };
        const format = 'MMMM Do YYYY, h:mm:ss a';
        const displayStartDate = appointment.startTime.format(format);
        const displayEndDate = appointment.endTime.format(format);
        return (
            <div className="appointment" style={appointmentStyles}>
                <div className="appointment__username">{appointment.name}</div>
                <div className="appointment__date">{`${displayStartDate} - ${displayEndDate}`}</div>
                <div className="appointment__title">{appointment.title}</div>
            </div>
        );
    }

    renderDoctrosSchedule(doctor, workingHours, scale, startDay, tablesCount) {
        const { patients, appointments } = this.props;
        const patientsArray = patients.get('models').toArray();
        const appointmentsArray = appointments.get('models').toArray();
        let apps = appointmentsArray.length && appointmentsArray
          .filter(app => (app.practitionerId === doctor.id  && moment({hour: 23, minute: 59}) > moment(app.startTime)))
          .map(app => {
           const patient = patientsArray.filter(pt => pt.id === app.patientId)[0];
           const patientName = patient && `${patient.firstName} ${patient.lastName}`;
           const { title, startTime, endTime, practitionerId } = app;
           const appObject = {
            title, 
            startTime: moment(startTime), 
            endTime: moment(endTime), 
            practitionerId
           }
           return Object.assign({}, appObject, { name: patientName });
        })
        if (typeof apps !== "object") apps = [];
        const doctorAppointments = apps.filter(app => app.practitionerId === doctor.id);
        const doctorScheduleColumn = {
            display: 'inline-block',
            position: 'relative',
            width: `${tablesCount}%`,
        }
        const workingHour = {
            height: `${scale * 60}px`,
            color: "white",
        }
        return (
            <div className="schedule__body" style={doctorScheduleColumn}>
                {workingHours.map((h) => (
                    <div className="schedule__element" style={workingHour}>
                        {h}
                    </div>
                ))}
                {doctorAppointments.map(app => this.renderAppoinment(app, scale, startDay))}
            </div>
        );
    }
    renderTimeColumn(workingHours, workingMinutes, scale, tablesCount) {
        const workingHoursColumn = {
            width: `${tablesCount/2}%`,
            display: 'inline-block',
        };
        const workingHour = {
            height: `${scale * 60}px`,
        };
        return (
            <div className="schedule__header" style={workingHoursColumn}>
                {workingHours.map((h) => (
                    <div className="schedule__element" style={workingHour}>
                        <div className="schedule__date">
                            {moment({hour: h, minute: 0}).format("h:mm a")}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    render() {
        // const currentDate = store.getState().date.toJS().scheduleDate;
        const currentDate = this.props.currentDate.toJS().scheduleDate; 
        const dayOftheWeek = new Date(currentDate._d).toLocaleString('en-us', {  weekday: 'long' });
        const dayOftheMonth = currentDate.date();
        const currentMonth = currentDate.format("MMMM");
        const { practitioners, patients, appointments } = this.props;
        const start = moment({hour: 0, minute: 0});
        const end = moment({hour: 23, minute: 59});
        const workingMinutes = end.diff(start, 'minutes');
        const startHours = start.get("hours");
        const endHours = end.get("hours");
        const workingHours = [];
        for (let i = startHours; i <= endHours; i++) {
            workingHours.push(i);
        }
        const practitionersArray = practitioners.get('models').toArray();
        let tablesCount = ( 100 / (practitionersArray.length + 1) );
        const scale = 1.5; // 1 minute = scale px so that appointment which
        //takes 30 minutes will have 300px height
        return (
            <div className="schedule">
                <div className="schedule__title title">
                    <div className="title__side">
                        <div className="title__month">{currentMonth}</div>
                        <div className="title__day">{dayOftheWeek}</div>
                    </div>
                    <div className="title__number">{dayOftheMonth}</div>
                </div>
                {this.renderTimeColumn(workingHours, workingMinutes, scale, tablesCount)}
                {practitionersArray.map(d => (
                    this.renderDoctrosSchedule(d, workingHours, scale, start, tablesCount)
                ))}
            </div>
        );
    }
}

function mapStateToProps({entities, date}) {
    return {
        appointments: entities.get('appointments'),
        practitioners: entities.get('practitioners'),
        patients: entities.get('patients'),
        currentDate: date,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchEntities,
    }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(SelectedDay);

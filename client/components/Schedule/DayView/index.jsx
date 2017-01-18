import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import {fetchEntities} from '../../../thunks/fetchEntities';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './index.css'

class SelectedDay extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.renderDoctrosSchedule = this.renderDoctrosSchedule.bind(this);
        this.renderTimeColumn = this.renderTimeColumn.bind(this);
        const appointments = [
            {
                name: "PAtient1",
                startDate: moment({hour: 12, minute: 30}),
                endDate: moment({hour: 13, minute: 30}),
                doctorId: "789",
                title: "regular check",
            },
            {
                name: "PAtient2",
                startDate: moment({hour: 5, minute: 30}),
                endDate: moment({hour: 6, minute: 30}),
                doctorId: "456",
                title: "regular check"
            },
            {
                name: "PAtient3",
                startDate: moment({hour: 4, minute: 3}),
                endDate: moment({hour: 6, minute: 30}),
                doctorId: "123",
                title: "regular check",
            },
            {
                name: "PAtient3",
                startDate: moment({hour: 16, minute: 3}),
                endDate: moment({hour: 18, minute: 30}),
                doctorId: "456",
                title: "regular check",
            },
        ];

        const doctors = [
            {
                id: "123",
                name: "Petrov",

            },
            {
                id: "456",
                name: "Strange",
            },
            {
                id: "789",
                name: "Beits",
            }
        ];
        let tablesCount = ( 100 / (doctors.length + 1) );
        const scale = 1.5; // 1 minute = scale px so that appointment which
        //takes 30 minutes will have 300px height
        this.appointments = appointments;
        this.scale = scale;
        this.doctors = doctors;
        this.tablesCount = tablesCount;
    }

    componentDidMount() {
        this.props.fetchEntities({key: 'appointments'});
    }

    renderAppoinment(appointment, scale, startDay) {
        const start = appointment.startDate;
        const end = appointment.endDate;
        const minutesDuration = end.diff(start, 'minutes');

        const positionTop = start.diff(startDay, 'minutes') * scale;

        const appointmentStyles = {
            height: `${minutesDuration * scale}px`,
            top: `${positionTop}px`,
        };

        const format = 'MMMM Do YYYY, h:mm:ss a';
        const displayStartDate = appointment.startDate.format(format);
        const displayEndDate = appointment.endDate.format(format);

        return (
            <div className="appointment" style={appointmentStyles}>
                <div className="appointment__username">{appointment.name}</div>
                <div className="appointment__date">{`${displayStartDate} - ${displayEndDate}`}</div>
                <div className="appointment__title">{appointment.title}</div>
            </div>
        );
    }

    renderDoctrosSchedule(doctor, workingHours, appointments, scale, startDay) {
        const doctorAppointments = appointments.filter(app => app.doctorId === doctor.id);
        const doctorScheduleColumn = {
            display: 'inline-block',
            position: 'relative',
            width: `${this.tablesCount}%`,
        }
        const workingHour = {
            height: `${scale * 60}px`,
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

    renderTimeColumn(workingHours, workingMinutes, scale) {
        const workingHoursColumn = {
            width: `${this.tablesCount}%`,
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
                            {h}
                        </div>
                    </div>
                ))}
            </div>
        );

    }

    render() {
        const start = moment({hour: 0, minute: 0});
        const end = moment({hour: 23, minute: 59});
        const workingMinutes = end.diff(start, 'minutes');

        const startHours = start.get("hours");
        const endHours = end.get("hours");

        const workingHours = [];
        for (let i = startHours; i <= endHours; i++) {
            workingHours.push(i);
        }


        const doctors = this.doctors;
        const appointments = this.appointments;
        const scale = this.scale;
        return (
            <div className="schedule">
                <div className="schedule__title title">
                    <div className="title__month">Wednesday</div>
                    <div className="title__day">FEBRUARY</div>
                    <div className="title__number">15</div>
                </div>
                {this.renderTimeColumn(workingHours, workingMinutes, scale)}
                {doctors.map(d => (
                    this.renderDoctrosSchedule(d, workingHours, appointments, scale, start)
                ))}
            </div>
        );
    }
}


function mapStateToProps({entities}) {
    return {
        appointments: entities.get('appointments'),
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchEntities,
    }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(SelectedDay);

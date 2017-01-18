import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { fetchEntities } from '../../../thunks/fetchEntities';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class SelectedDay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderDoctrosSchedule = this.renderDoctrosSchedule.bind(this);
 		this.renderTimeColumn = this.renderTimeColumn.bind(this);
    const appointments = [
    	{
    		name: "PAtient1",
    		startTime: moment({hour: 12, minute: 30}),
    		endTime: moment({hour: 13, minute: 30}),
    		doctorId: "789",
    		title: "regular check",
    	},
    	{
    		name: "PAtient2",
    		startTime: moment({hour: 5, minute: 30}),
    		endTime: moment({hour: 6, minute: 30}),
    		doctorId: "456",
    		title: "regular check"
    	},
    	{
    		name: "PAtient3",
    		startTime: moment({hour: 4, minute: 3}),
    		endTime: moment({hour: 6, minute: 30}),
    		doctorId: "123",
    		title: "regular check",
    	},
    	{
    		name: "PAtient3",
    		startTime: moment({hour: 16, minute: 3}),
    		endTime: moment({hour: 18, minute: 30}),
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
   	const scale = 3; // 1 minute = scale px so that appointment which 
   	//takes 30 minutes will have 300px height
   	this.appointments = appointments;
   	this.scale = scale;
   	this.doctors = doctors;

 	}

  componentDidMount() {
    this.props.fetchEntities({ key: 'appointments' });
  }

 	renderAppoinment(appointment, scale, startDay) {
 		const start = appointment.startTime;
 		const end = appointment.endTime;
 		const minutesDuration = end.diff(start, 'minutes');

 		const positionTop = start.diff(startDay, 'minutes') * scale;

 		const appointmentStyles = {
 			width: '100%',
 			height: `${minutesDuration * scale}px`,
 			border: '1px solid black',
 			position: 'absolute',
 			top: `${positionTop}px`, 
 		}

 		const format = 'MMMM Do YYYY, h:mm:ss a';
 		const displayStartDate = appointment.startTime.format(format);
 		const displayEndDate = appointment.endTime.format(format);

 		return (
 			<div style={appointmentStyles} >
 				<div>{appointment.name}</div>
 				<div>{`${displayStartDate} - ${displayEndDate}`}</div>
 				<div>{appointment.title}</div>
 			</div>
 		);
 	}

  renderDoctrosSchedule(doctor, workingHours, appointments, scale, startDay) {
  	const doctorAppointments = appointments.filter(app => app.doctorId === doctor.id);
  	const doctorScheduleColumn = {
  		width: '100px',
  		border: '1px solid black',
  		display: 'inline-block',
  		position: 'relative',
  	}
  	const workingHour = {
  		height: `${scale * 60}px`,
  		width: '100px',
  	}

  	return (
  		<div style={doctorScheduleColumn} >
  			{workingHours.map((h) => (
  				<div style={workingHour} >
  					{h}
  				</div>
  			))}
  			{doctorAppointments.map(app => this.renderAppoinment(app, scale, startDay))}
  		</div>
  	);
  }

  renderTimeColumn(workingHours, workingMinutes, scale) {
  	const workingHoursColumn = {
  		border: '1px solid black',
  		width: '100px',
  		display: 'inline-block',
  	}

  	const workingHour = {
  		height: `${scale * 60}px`,
  		width: '100px',
  	}
  	return (
  		<div style={workingHoursColumn} >
  			{workingHours.map((h) => (
  				<div style={workingHour} >
  					{h}
  				</div>
  			))}
  		</div>
  	);

  }

  render() {
    debugger;
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
     	<div>
     		{this.renderTimeColumn(workingHours, workingMinutes, scale)}
     		{doctors.map( d => (
     			this.renderDoctrosSchedule(d, workingHours, appointments, scale, start)
     		))}
    	 </div>
  	);
  }
}



function mapStateToProps({ entities }) {
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

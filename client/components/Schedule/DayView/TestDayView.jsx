
import React, { Component } from 'react';
import moment from 'moment';

class TestDayView extends Component  {

  constructor(props) {
    super(props);
    this.renderAppointments = this.renderAppointments.bind(this);
  }

  renderAppointments(pr) {
    const { patients, appointments, currentDate } = this.props;
    const filteredApps = appointments.toArray().filter((app) => {
        return app.practitionerId === pr.id;
    });
    filteredApps.map((app) => {

      const momentDate = moment(currentDate);
      const momentStartDate = moment(app.startDate);
      const theSameDay = momentDate.date() === momentStartDate.date();
      const theSameMonth = momentDate.month() === momentStartDate.month();
      const theSameYear = momentDate.year() === momentStartDate.year();
      const theSameDate = theSameDay && theSameMonth && theSameYear;

      if (theSameDate) {
        const filteredPatients = patients.toArray().filter((patient) => patient.id === app.patientId);
        console.log(filteredPatients[0].get('firstName'));
      }

    });

    return(
      <div>

      </div>
    );
  }


  render() {
    const {
      practitioners,
      schedule,
    } = this.props;

    let practitionersArray = practitioners.get('models').toArray();
    const checkedPractitioners = schedule.toJS().practitionersFilter;

    if (checkedPractitioners.length) {
      practitionersArray = practitionersArray.filter(pr => checkedPractitioners.indexOf(pr.id) > -1);
    }

    return (
      <div>
        {practitionersArray.map((pr) => {
          return (
            this.renderAppointments(pr)
          )
        })}
      </div>
    );
  }

}

export default TestDayView;

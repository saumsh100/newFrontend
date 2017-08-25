
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { List, Card, CardHeader, } from '../../../library';
import ReminderData from './ReminderData';
import { SortByCreatedAtDesc } from '../../../library/util/SortEntities';
import styles from './styles.scss';

class RemindersList extends Component {
  constructor(props) {
    super(props)
    this.handleReminderClick = this.handleReminderClick.bind(this);
    this.handleAppointmentClick = this.handleAppointmentClick.bind(this);
  }

  handleReminderClick(id) {
    const {
      setSelectedPatientId,
      push,
    } = this.props;

    setSelectedPatientId(id);
    push('/patients/list');
  }

  handleAppointmentClick(startDate) {
    const {
      setScheduleDate,
      push,
    } = this.props;

    setScheduleDate({ scheduleDate: moment(startDate) });
    push('/schedule');
  }

  render() {
    const {
      appointments,
      patients,
      reminders,
      sentReminders,
    } = this.props;

    if (!patients || !reminders || !sentReminders || !appointments ) {
      return null;
    }

    const sortReminders = sentReminders.sort(SortByCreatedAtDesc);

    return (
      <Card className={styles.reminders}>
        <div className={styles.reminders__header}>
          <CardHeader
            count={sentReminders.size}
            title="Sent Reminders"
            data-test-id="sentRemindersCount"
          />
        </div>
        <div className={styles.reminders__body}>
          <List className={styles.patients}>
            {sortReminders.map((sentReminder, index) => {

              if (!sentReminder) {
                return null;
              }

              return (
                <ReminderData
                  key={index}
                  index={index}
                  appointment={appointments.get(sentReminder.get('appointmentId'))}
                  reminder={reminders.get(sentReminder.get('reminderId'))}
                  patient={patients.get(sentReminder.get('patientId')).toJS()}
                  sentReminder={sentReminder}
                  handleReminderClick={this.handleReminderClick}
                  handleAppointmentClick={this.handleAppointmentClick}
                />
              );
            })}
          </List>
        </div>
      </Card>
    );
  }
}

RemindersList.propTypes = {
  appointments: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  sentReminders: PropTypes.object.isRequired,
  reminders: PropTypes.object.isRequired,
};

export default RemindersList;

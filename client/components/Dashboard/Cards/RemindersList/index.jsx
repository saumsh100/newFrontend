
import React, { Component } from 'react';
import { List, Card, CardHeader, } from '../../../library';
import ReminderData from './ReminderData';
import styles from './styles.scss';

class RemindersList extends Component {
  constructor(props) {
    super(props)
    this.handleReminderClick = this.handleReminderClick.bind(this);
  }

  handleReminderClick(id) {
    const {
      setSelectedPatientId,
      push,
    } = this.props;

    setSelectedPatientId(id);
    push('/patients/list');
  }

  render() {
    const {
      appointments,
      patients,
      reminders,
      sentReminders,
    } = this.props;

    return (
      <Card className={styles.reminders}>
        <div className={styles.reminders__header}>
          <CardHeader count={sentReminders.size} title="Reminders" />
        </div>
        <div className={styles.reminders__body}>
          <List className={styles.patients}>
            {sentReminders.toArray().map((sentReminder,index) => {
              return (
                <ReminderData
                  key={index}
                  index={index}
                  appointment={appointments.get(sentReminder.get('appointmentId')).toJS()}
                  reminder={reminders.get(sentReminder.get('reminderId')).toJS()}
                  patient={patients.get(sentReminder.get('patientId')).toJS()}
                  sentReminder={sentReminder}
                  handleReminderClick={this.handleReminderClick}
                />
              );
            })}
          </List>
        </div>
      </Card>
    );
  }
}

export default RemindersList;

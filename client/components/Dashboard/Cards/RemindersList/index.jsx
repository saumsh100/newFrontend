
import React, { Component, PropTypes } from 'react';
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

    if (!patients || !reminders || !sentReminders || !appointments ) {
      return null;
    }

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
            {sentReminders.toArray().map((sentReminder, index) => {

              if (!sentReminder) {
                return null;
              }

              return (
                <ReminderData
                  key={index}
                  index={index}
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

RemindersList.propTypes = {
  appointments: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  sentReminders: PropTypes.object.isRequired,
  reminders: PropTypes.object.isRequired,
};

export default RemindersList;

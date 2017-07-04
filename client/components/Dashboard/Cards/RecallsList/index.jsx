import React, { Component, PropTypes } from 'react';
import { List, Card, CardHeader, } from '../../../library';
import RecallData from './RecallData';
import styles from './styles.scss';

class RecallsList extends Component {
  constructor(props) {
    super(props)
    this.handleRecallClick = this.handleRecallClick.bind(this);
  }

  handleRecallClick(id) {
    const {
      setSelectedPatientId,
      push,
    } = this.props;

    setSelectedPatientId(id);
    push('/patients/list');
  }

  render() {
    const {
      patients,
      recalls,
      sentRecalls,
    } = this.props;

    if (!patients || !recalls || !sentRecalls) {
      return null;
    }

    console.log(sentRecalls);

    return (
      <Card className={styles.reminders}>
        <div className={styles.reminders__header}>
          <CardHeader count={sentRecalls.size} title="Sent Recalls" />
        </div>
        <div className={styles.reminders__body}>
          <List className={styles.patients}>
            {sentRecalls.toArray().map((sentRecall, index) => {

              if (!sentRecall) {
                return null;
              }

              return (
                <RecallData
                  key={index}
                  index={index}
                  recallJS={recalls.get(sentRecall.get('recallId'))}
                  patientJS={patients.get(sentRecall.get('patientId'))}
                  sentRecall={sentRecall}
                  handleRecallClick={this.handleRecallClick}
                />
              );
            })}
          </List>
        </div>
      </Card>
    );
  }
}

RecallsList.propTypes = {
  patients: PropTypes.object.isRequired,
  recalls: PropTypes.object.isRequired,
  sentRecalls: PropTypes.object.isRequired,
};

export default RecallsList;

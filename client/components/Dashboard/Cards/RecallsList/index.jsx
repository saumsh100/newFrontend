import React, { Component } from 'react';
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

    return (
      <Card className={styles.reminders}>
        <div className={styles.reminders__header}>
          <CardHeader count={sentRecalls.size} title="Recalls" />
        </div>
        <div className={styles.reminders__body}>
          <List className={styles.patients}>
            {sentRecalls.toArray().map((sentRecall,index) => {
              return (
                <RecallData
                  key={index}
                  index={index}
                  recall={recalls.get(sentRecall.get('recallId')).toJS()}
                  patient={patients.get(sentRecall.get('patientId')).toJS()}
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

export default RecallsList;

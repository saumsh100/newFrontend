import React, { Component } from 'react';
import { Card, CardHeader, LineChart } from '../../../../library';
import styles from './styles.scss';


class AppointmentsBooked extends Component {
  render() {
    const {
      borderColor,
      cardTitle,
      labels,
      dataSets,

    } = this.props;
    return (
      <Card className={styles.booked} borderColor={borderColor}>
        <div className={styles.booked__header}>
          <CardHeader title={cardTitle} />
        </div>
        <div className={styles.booked__body}>
          <LineChart
            displayTooltips={true}
            labels={labels}
            dataSets={dataSets}
          />
        </div>
      </Card>
    );
  }
}


export default AppointmentsBooked;

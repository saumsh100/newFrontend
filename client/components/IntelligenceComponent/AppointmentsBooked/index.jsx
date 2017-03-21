import React, { Component } from 'react';
import { Card, CardHeader, LineChart } from '../../library';
import styles from './styles.scss';


class AppointmentsBooked extends Component {
  render() {
    const {
      borderColor,
      cardTitle,
    } = this.props;
    return (
      <Card className={styles.booked} borderColor={borderColor}>
        <div className={styles.booked__header}>
          <CardHeader title={cardTitle} />
        </div>
        <div className={styles.booked__body}>
          <LineChart
            displayTooltips={true}
            labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
            dataSets={[
              {
                label: 'Appointments Booked',
                color: 'yellow',
                data: [125, 150, 143, 200, 180, 220, 300 ],
              }
            ]}
          />
        </div>
      </Card>
    );
  }
}


export default AppointmentsBooked;

import React, { Component } from 'react';
import { Card, CardHeader, LineChart } from '../../library';
import styles from './styles.scss';


class AppointmentsBooked extends Component {
  render() {
    const {
      cardCount,
      cardTitle,
    } = this.props;
    return (
      <Card className={styles.booked}>
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
                        data: [65, 59, 80, 81, 56, 55, 40],
                    },
                    {
                        label: 'Appointments Cancelled',
                        color: 'red',
                        data: [10, 12, 13, 3, 2, 1, 0],
                    },
                ]}
            />
        </div>
      </Card>
    );
  }
}


export default AppointmentsBooked;

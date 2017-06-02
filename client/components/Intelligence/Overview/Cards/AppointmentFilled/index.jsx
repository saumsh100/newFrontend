import React, { Component } from 'react';
import { Guage, Card } from '../../../../library';
import styles from './styles.scss';


class AppointmentFilled extends Component {
  render() {
    const { borderColor, appointmentFilled, appointmentNotFilled, startDate, endDate } = this.props;
    const percentage = Math.floor(100 * appointmentFilled / appointmentNotFilled);

    return (
      <Card className={styles.appointmentFilled} >
        <div className={styles.appointmentFilled__wrapper}>
          <div className={styles.appointmentFilled__header}>
            <div className={styles.appointmentFilled__header_number}>
              {appointmentNotFilled}
            </div>
            <div className={styles.appointmentFilled__header_title}>
              Productivity Hours Not Filled
            </div>
            <div className={styles.appointmentFilled__header_date}>
              02/01/2017 - 02/25/2017
            </div>
          </div>
          <Guage percentage={percentage} width={100} height={100}/>
        </div>
      </Card>
    );
  }
}


export default AppointmentFilled;

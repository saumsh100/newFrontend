import React, { Component } from 'react';
import { Guage, Card } from '../../../../library';
import styles from './styles.scss';


class AppointmentFilled extends Component {
  render() {
    const { borderColor } = this.props;
    return (
      <Card className={styles.appointmentFilled} borderColor={borderColor}>
        <div className={styles.appointmentFilled__wrapper}>
          <div className={styles.appointmentFilled__header}>
            <div className={styles.appointmentFilled__header_number}>
              160
            </div>
            <div className={styles.appointmentFilled__header_title}>
              Appointments Not Filled
            </div>
            <div className={styles.appointmentFilled__header_date}>
              02/01/2017 - 02/25/2017
            </div>
          </div>
          <Guage percentage={34} width={100} height={100}/>
        </div>
      </Card>
    );
  }
}


export default AppointmentFilled;

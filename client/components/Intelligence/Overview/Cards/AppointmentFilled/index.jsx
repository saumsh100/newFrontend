import React, { Component } from 'react';
import moment from 'moment';
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
              {moment(startDate).format('MM/DD/YYYY')} - {moment(endDate).format('MM/DD/YYYY')}
            </div>
          </div>
          <Guage percentage={percentage} width={100} height={100}/>
        </div>
      </Card>
    );
  }
}


export default AppointmentFilled;

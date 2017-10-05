import React, { Component } from 'react';
import moment from 'moment';
import { Guage, Card } from '../../../../library';
import styles from './styles.scss';

function nFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/i;
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
    }
  }
  return num.toFixed(digits).replace(rx, '$1');
}


class AppointmentFilled extends Component {
  render() {
    const { borderColor, appointmentFilled, appointmentNotFilled, startDate, endDate } = this.props;
    const percentage = Math.floor(100 * appointmentFilled / appointmentNotFilled);

    return (
      <Card className={styles.appointmentFilled} >
        <div className={styles.appointmentFilled__wrapper}>
          <div className={styles.appointmentFilled__header}>
            <div className={styles.appointmentFilled__header_number}>
              {nFormatter(appointmentNotFilled, 1)}
            </div>
            <div className={styles.appointmentFilled__header_title}>
              Production Hours Not Filled
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

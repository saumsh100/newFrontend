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

    const ticks = {
      fontSize: 10,
      fontFamily: 'Gotham-Medium',
      fontColor: '#2e3845',
      padding: 15,
      maxRotation: 0,
      autoSkip: false,
    };

    const lineChartOptions = {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks,
          gridLines: {
            beginAtZero: true,
            drawTicks: false,
          },
        }],

        xAxes: [{
          ticks,
          gridLines: {
            offsetGridLines: true,
            display: true,
            drawTicks: false,
            drawOnChartArea: false,
          },
        }],
      },
    };
    return (
      <Card className={styles.booked} >
        <div className={styles.booked__header}>
          <CardHeader title={cardTitle} />
        </div>
        <div className={styles.booked__body}>
          <LineChart
            displayTooltips
            height={500}
            labels={labels}
            dataSets={dataSets}
            options={lineChartOptions}
          />
        </div>
      </Card>
    );
  }
}


export default AppointmentsBooked;

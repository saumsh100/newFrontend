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

    const test = dataSets[0].data.length;
    const ticks = {
      fontSize: 16,
      fontFamily: 'Gotham-Book',
      fontColor: '#2e3845',
      padding: 30,
      maxRotation: 0,
      autoSkip: false,
      callback(value, index) {
        if (typeof value === 'number' && index % 40 === 0) {
          if (Number.isSafeInteger(value)) {
            return value;
          }
        }
        if (typeof value !== 'number') {
          return value;
        }
      },
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

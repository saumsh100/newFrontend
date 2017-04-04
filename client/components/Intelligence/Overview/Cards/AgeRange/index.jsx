import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, BarChart } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function AgeRange(props) {
  const {
    chartData,
  } = props;

  return (
    <Card borderColor={colorMap.green} className={styles.card}>
      <CardHeader className={styles.cardHeader} title="Age Range" />
      <div className={styles.ageRange}>
        <div className={styles.ageRange__content}>
          <BarChart
            type="horizontal"
            displayTooltips
            labels={["18-24", "25-34", "35-44", "45-54", "55+"]}
            dataSets={[{
              label: 'Appointments Booked',
              color: ['yellow', 'red', 'green', 'blue'],
              data: chartData
            }]}
          />
        </div>
      </div>
    </Card>
  );
}

AgeRange.propTypes = {
  chartData: PropTypes.arrayOf(Number)
};

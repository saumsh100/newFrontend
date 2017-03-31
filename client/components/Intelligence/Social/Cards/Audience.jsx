import React, { PropTypes } from 'react';
import { Card, CardHeader, LineChart } from '../../../library';
import colorMap from '../../../library/util/colorMap';
import styles from '../styles.scss';

export default function Audience(props) {
  const {
    title,
    chartData,
  } = props;

  return (
    <Card className={styles.booked} borderColor={colorMap.darkblue}>
      <div className={styles.booked__header}>
        <CardHeader title={title} />
      </div>
      <div className={styles.booked__body}>
        <LineChart
          displayTooltips={true}
          labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
          dataSets={[
            {
              label: 'Appointments Booked',
              color: 'yellow',
              data: chartData,
            }
          ]}
        />
      </div>
    </Card>
  );
}

Audience.propTypes = {
  title: PropTypes.string,
  chartData: PropTypes.arrayOf(Number)
};

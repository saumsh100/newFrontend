import React, { PropTypes } from 'react';
import { Card, CardHeader, LineChart } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function Audience(props) {
  const {
    title,
    labels,
    data,
  } = props;

  return (
    <Card className={styles.booked} borderColor={colorMap.darkblue}>
      <div className={styles.booked__header}>
        <CardHeader title={title} />
      </div>
      <div className={styles.booked__body}>
        <LineChart
          displayTooltips
          labels={labels}
          dataSets={[
            {
              label: 'Appointments Booked',
              color: 'yellow',
              data
            }
          ]}
        />
      </div>
    </Card>
  );
}

Audience.propTypes = {
  title: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.number)
};

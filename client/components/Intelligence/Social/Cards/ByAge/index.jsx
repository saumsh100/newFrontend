
import React, { PropTypes } from 'react';
import { Card, CardHeader, BarChart } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function ByAge(props) {
  const { labels, data } = props;

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader} title="By Age" />
      <div className={styles.ageRange}>
        <div className={styles.ageRange__content}>
          <BarChart
            type="horizontal"
            displayTooltips
            labels={labels}
            dataSets={[
              {
                label: 'Appointments Booked',
                color: ['yellow', 'red', 'green', 'blue'],
                data,
              },
            ]}
          />
        </div>
      </div>
    </Card>
  );
}

ByAge.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
};

import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, BarChart } from '../../../library';
import colorMap from '../../../library/util/colorMap';
import styles from '../styles.scss';

export default function AgeRange(props) {
  const {
    labels,
    dataSets,
  } = props;

  return (
    <Card borderColor={colorMap.green} className={styles.card}>
      <CardHeader className={styles.cardHeader} title="Age Range" />
      <div className={styles.ageRange}>
        <div className={styles.ageRange__content}>
          <BarChart
            type="horizontal"
            displayTooltips
            labels={labels}
            dataSets={dataSets}
          />
        </div>
      </div>
    </Card>
  );
}

AgeRange.propTypes = {
  labels: PropTypes.arrayOf(String),
  dataSets: PropTypes.arrayOf(Object)
};

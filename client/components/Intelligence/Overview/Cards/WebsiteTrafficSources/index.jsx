import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Card, CardHeader, BarChart } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function WebsiteTrafficSources(props) {
  const {
    chartData,
    labels,
    title,
  } = props;

  return (
    <Card className={styles.websiteTrafikSources}>
      <div className={styles.websiteTrafikSources__header}>
        <CardHeader title={title} />
      </div>
      <div className={styles.websiteTrafikSources__mainContent}>
        <BarChart
          displayTooltips
          labels={labels}
          dataSets={chartData}
        />
      </div>
    </Card>
  );
}

WebsiteTrafficSources.propTypes = {
  chartData: PropTypes.arrayOf(Object),
};

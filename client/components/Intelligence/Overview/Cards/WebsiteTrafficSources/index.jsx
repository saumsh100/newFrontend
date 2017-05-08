import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Card, CardHeader, BarChart } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function WebsiteTrafficSources(props) {
  const {
    chartData,
  } = props;

  return (
    <Card >
      <CardHeader className={styles.cardHeader} title="Website Traffic Sources" />
      <div className={styles.websiteTrafikSources}>
        <div className={styles.websiteTrafikSources__mainContent}>
          <BarChart
            displayTooltips
            labels={['Direct', 'Referrals', 'Search', 'Social', 'Mail', 'Display']}
            dataSets={chartData}
          />
        </div>
      </div>
    </Card>
  );
}

WebsiteTrafficSources.propTypes = {
  chartData: PropTypes.arrayOf(Object),
};

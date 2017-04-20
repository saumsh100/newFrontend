import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, PieChart } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function NewVsReturning(props) {
  const {
    newVisitors,
    returningVisitors,
    chartData,
  } = props;

  return (
    <Card borderColor={colorMap.grey}>
      <CardHeader className={styles.cardHeader} title={'New vs Returning Visitors'} />
      <div className={styles.byGender}>
        <div className={styles.byGender__stats}>
          <div className={styles.byGender__stats__percentage} >
            <span className={styles.byGender__stats__percentage_left} >{newVisitors}%</span>
            <span className={styles.byGender__stats__percentage_left} >New Visitors</span>
          </div>
          <div className={styles.byGender__stats__percentage} >
            <span className={styles.byGender__stats__percentage_right} >{returningVisitors}%</span>
            <span className={styles.byGender__stats__percentage_right} >Returning Visitors</span>
          </div>
        </div>
        <div className={styles.pieChartWrapper}>
          <PieChart
            type="doughnut"
            data={chartData}
          />
        </div>
      </div>
    </Card>
  )
}

NewVsReturning.propTypes = {
  newVisitors:  PropTypes.number,
  returningVisitors:  PropTypes.number,
  chartData: PropTypes.array,
};

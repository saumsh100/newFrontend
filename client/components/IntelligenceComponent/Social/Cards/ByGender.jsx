import React, { PropTypes } from 'react';
import { Card, CardHeader, Icon, PieChart } from '../../../library';
import colorMap from '../../../library/util/colorMap';
import styles from '../styles.scss';

export default function ByGender(props) {
  const {
    maleCount,
    femaleCount,
    chartData,
  } = props;

  return (
    <Card borderColor={colorMap.darkblue}>
      <CardHeader className={styles.cardHeader} title={'By Gender'} />
      <div className={styles.byGender}>
        <div className={styles.byGender__stats}>
          <div className={styles.byGender__stats__percentage} >
            <div className={styles.byGender__stats__percentage_left}>
              <Icon icon="male" />
              <span className={styles.byGender__stats__percentage__count}>{maleCount}%</span>
            </div>
            <span className={styles.byGender__gender}>Male</span>
          </div>
          <div className={styles.byGender__stats__percentage} >
            <div className={styles.byGender__stats__percentage_right}>
              <Icon icon="female" />
              <span>{femaleCount}%</span>
            </div>
            <span className={styles.byGender__gender}>Female</span>
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
  );
}

ByGender.propTypes = {
  maleCount: PropTypes.number,
  femaleCount: PropTypes.number,
  chartData: PropTypes.string,
};

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { Card, Star } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function RatingsChart(props) {
  const {
    rating,
  } = props;

  const ratingStars = _.keys(rating).sort((a,b) => a > b);
  const maxValue = _.max(_.values(rating));

  return (
    <Card borderColor={colorMap.blue} className={styles.card}>
      <div className={styles.stats}>
        {ratingStars.map((r) => {
          const rows = [];
          for (let i = 1; i <= r; i++) {
            rows.push(<Star size={1.3} />);
          }
          const width = rating[r] ? (Math.floor((rating[r] / maxValue) * 80)) : 5;
          const style = { width: `${width}%` };
          return (
            <div className={styles.content}>
              <div className={styles.content__stars}>
                {rows}
              </div>
              <div className={styles.content__bar}>
                <span
                  style={style}
                  className={styles.content__bar__percent}
                />
                {rating[r]}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  )
}

RatingsChart.PropTypes = {
  rating: PropTypes.object,
}

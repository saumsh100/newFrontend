
import React, { Component, PropTypes } from 'react';
import max from 'lodash/max';
import values from 'lodash/values';
import { Card, Star } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function RatingsChart(props) {
  const { rating } = props;
  // const ratingStars = _.keys(rating).sort((a,b) => a < b);
  const ratingStars = ['5', '4', '3', '2', '1', '0'];
  const maxValue = max(values(rating));

  const hasRatings = Object.keys(rating).length;

  const ratingDefaults = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  const mergedRatings = hasRatings ? Object.assign({}, ratingDefaults, rating) : ratingDefaults;

  return (
    <Card className={styles.card}>
      <div className={styles.stats}>
        {hasRatings ? (
          ratingStars.map((r, index) => {
            const rows = [];
            for (let i = 0; i < r; i++) {
              rows.push(<Star key={i} size={1.8} />);
            }
            const width = mergedRatings[r] ? Math.floor(mergedRatings[r] / maxValue * 80) : 5;
            const style = { width: `${width}%` };
            return (
              <div key={index} className={styles.content}>
                <div className={styles.content__stars}>
                  {r === '0' ? 'No Rating' : ''}
                  {rows}
                </div>
                <div className={styles.content__bar}>
                  <span style={style} className={styles.content__bar__percent} />
                  {mergedRatings[r]}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.stats_noReviews}> There are currently zero reviews. </div>
        )}
      </div>
    </Card>
  );
}

RatingsChart.PropTypes = {
  rating: PropTypes.object,
};

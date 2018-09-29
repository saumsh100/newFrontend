
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Star } from '../../../../library';
import styles from '../../styles.scss';

export default function RatingsChart(props) {
  const { rating } = props;
  const ratingStars = ['5', '4', '3', '2', '1', '0'];

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

  const sum = Object.values(mergedRatings).reduce((acc, value) => acc + value, 0);

  return (
    <Card className={styles.card}>
      <div className={styles.stats}>
        {hasRatings ? (
          ratingStars.map((r) => {
            const rows = [];
            for (let i = 0; i < r; i += 1) {
              rows.push(<Star key={i} size={1.8} />);
            }
            const width = mergedRatings[r] ? Math.ceil((mergedRatings[r] / sum) * 100) : 0;
            const style = { width: `${width}%` };
            return (
              <div className={styles.content}>
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

RatingsChart.propTypes = { rating: PropTypes.objectOf(PropTypes.number).isRequired };

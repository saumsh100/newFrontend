import PropTypes from 'prop-types';
import React from 'react';
import { Card, Star } from '../../../../library';
import styles from '../../styles.scss';

export default function AverageRating(props) {
  const { count, rating } = props;

  let countCeil = 0;
  if (Object.keys(rating).length !== 0) {
    let sum = 0;
    let totalStars = 0;
    for (let i = 0; i <= 5; i++) {
      if (rating[i]) {
        totalStars += rating[i];
        sum += rating[i] * i;
      }
    }

    countCeil = sum / totalStars;
    countCeil = countCeil.toFixed(1);
  }

  const rows = [];
  for (let i = 1; i <= countCeil; i++) {
    rows.push(<Star key={i} size={1.8} />);
  }

  return (
    <Card className={styles.card}>
      <div className={styles.stats}>
        <span className={styles.stats__count}>{countCeil}</span>
        <span className={styles.stats__title}>Average Rating</span>
        <div className={styles.stats__rating}>{rows}</div>
        <span className={styles.stats__bottom}>Industry Average {count.toFixed(1)}/5</span>
      </div>
    </Card>
  );
}

AverageRating.propTypes = {
  count: PropTypes.number,
  rating: PropTypes.object,
  average: PropTypes.number,
};

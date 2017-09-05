import React, { Component, PropTypes } from 'react';
import { Card, Star } from '../../../../library';
import _ from 'lodash';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function AverageRating(props) {
  const {
    count,
    rating
  } = props;

  let sum = 0;
  let totalStars = 0;
  for (let i = 0; i <= 5; i++) {
    if (rating[i]) {
      totalStars = totalStars + rating[i];
      sum = sum + (rating[i] * i);
    }
  }

  const countCeil = sum / totalStars;

  const rows = [];
  for (let i = 1; i <= countCeil; i++) {
    rows.push(<Star key={i} size={1.8} />);
  }




  return (
    <Card className={styles.card}>
      <div className={styles.stats}>
        <span className={styles.stats__count} >{countCeil.toFixed(1)}</span>
        <span className={styles.stats__title} >Average Rating</span>
        <div className={styles.stats__rating}>
          {rows}
        </div>
        <span className={styles.stats__bottom}>Industry Average {countCeil.toFixed(1)}/5</span>
      </div>
    </Card>
  );
}

AverageRating.PropTypes = {
  count: PropTypes.number,
  average: PropTypes.number,
}

import React, { Component, PropTypes } from 'react';
import { Card, Star } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function AverageRating(props) {
  const {
    count,
    average,
  } = props;

  let countFloor = Math.floor(count);

  const rows = [];
  for (let i = 1; i < count; i++) {
    rows.push(<Star key={i} size={1.8} />);
  }

  return (
    <Card className={styles.card}>
      <div className={styles.stats}>
        <span className={styles.stats__count} >{countFloor}</span>
        <span className={styles.stats__title} >Average Rating</span>
        <div className={styles.stats__rating}>
          {rows}
        </div>
        <span className={styles.stats__bottom}>Industry Average {countFloor}/{average}</span>
      </div>
    </Card>
  );
}

AverageRating.PropTypes = {
  count: PropTypes.number,
  average: PropTypes.number,
}

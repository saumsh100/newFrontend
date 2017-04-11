import React, { Component, PropTypes } from 'react';
import { Card, Star } from '../../../../library';
import colorMap from '../../../../library/util/colorMap';
import styles from '../../styles.scss';

export default function AverageRating(props) {
  return (
    <Card borderColor={colorMap.blue} className={styles.card}>
      <div className={styles.stats}>
        <span className={styles.stats__count} >4.7</span>
        <span className={styles.stats__title} >Average Rating</span>
        <div className={styles.stats__rating}>
          <Star size={1.3} />
          <Star size={1.3} />
        </div>
        <span className={styles.stats__bottom}>Industry Average 4.1/5</span>
      </div>
    </Card>
  )
}

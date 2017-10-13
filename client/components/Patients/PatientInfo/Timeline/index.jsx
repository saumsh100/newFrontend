import React, { Component, PropTypes } from 'react';
import { Card, Event } from '../../../library';
import styles from './styles.scss';

export default function Timeline(props) {
  return (
    <Card className={styles.card}>
      <div className={styles.eventsContainer}>
        <div className={styles.verticalLine}>&nbsp;</div>
        <div className={styles.eventsList}>
          <Event
            type="email"
          />
          <Event
            type="review"
          />
          <Event
            type="appointment"
          />
          <Event
            type="email"
          />
          <Event
            type="appointment"
          />
          <Event
            type="message"
          />
          <Event
            type="review"
          />
          <Event
            type="appointment"
          />
          <Event
            type="message"
          />
          <Event
            type="message"
          />
          <Event
            type="review"
          />
        </div>
      </div>
    </Card>
  );
}

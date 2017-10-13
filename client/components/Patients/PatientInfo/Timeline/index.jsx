import React, { Component, PropTypes } from 'react';
import { Card, Event } from '../../../library';
import styles from './styles.scss';

export default function Timeline(props) {
  return (
    <Card className={styles.card}>
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
    </Card>
  );
}

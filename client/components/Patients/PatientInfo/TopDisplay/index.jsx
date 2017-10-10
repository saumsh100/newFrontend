import React, { Component, PropTypes } from 'react';
import { Card } from '../../../library';
import styles from './styles.scss';

export default function TopDisplay(props) {
  return (
    <Card className={styles.card}>
      {props.patientId}
    </Card>
  );
}

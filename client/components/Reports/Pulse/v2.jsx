
import React from 'react';
import { Card } from '../../library';
import ReportParametersForm from '../../ReportParametersForm';
import styles from '../tabStyles.scss';

const PulseV2 = () => (
  <Card className={styles.card}>
    <ReportParametersForm />
  </Card>
);

PulseV2.propTypes = {};

export default PulseV2;

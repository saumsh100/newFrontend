
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from '../../../library';
import SettingsCard from '../../Shared/SettingsCard';
import styles from './styles.scss';

export default function CommunicationSettingsCard(props) {
  const {
    title, rightActions, leftColumn, rightColumn, children,
  } = props;

  return (
    <SettingsCard title={title} rightActions={rightActions}>
      <Grid className={styles.commsGrid}>
        <Row className={styles.commsRow}>
          <Col xs={6} className={styles.commsListCol}>
            {leftColumn}
          </Col>
          <Col xs={6}>{rightColumn}</Col>
        </Row>
      </Grid>
      {children}
    </SettingsCard>
  );
}

CommunicationSettingsCard.propTypes = {
  title: PropTypes.string,
  rightActions: PropTypes.element,
  leftColumn: PropTypes.element,
  rightColumn: PropTypes.element,
};


import React, { PropTypes } from 'react';
import { Grid, Row, Col, Card, CardHeader } from '../library';
import SettingsSubNav from './SettingsSubNav';
import styles from './styles.scss';

export default function Account(props) {
  return (
    <Grid>
      <Row className={styles.rowContainer}>
        <Col xs={3} className={styles.subSettingsCol}>
          <Card className={styles.subSettingsCard}>
            <CardHeader title="Clinic Settings" />
            <SettingsSubNav location={props.location} />
          </Card>
        </Col>
        <Col xs={9} className={styles.settingsFormsCol}>
          <Card className={styles.settingsFormsCard}>
            {props.children}
          </Card>
        </Col>
      </Row>
    </Grid>
  );
}

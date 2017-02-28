
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Card, CardHeader } from '../library';
import SettingsSubNav from './SettingsSubNav';
import General from './Clinic/General'
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
            <CardHeader title="General Settings" />
           <General {...props} />
          </Card>
        </Col>
      </Row>
    </Grid>
  );
}

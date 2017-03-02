
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Card, CardHeader } from '../library';
import SettingsSubNav from './SettingsSubNav';
import General from './Clinic/General';
import Address from './Clinic/Address'
import styles from './styles.scss';

export default function Settings(props) {
  console.log('activeAccount', props.activeAccount);
  const children = React.cloneElement(props.children, { activeAccount: props.activeAccount });
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
            {children}
          </Card>
        </Col>
      </Row>
    </Grid>
  );
}

Settings.propTypes = {
  activeAccount: PropTypes.props,
  location: PropTypes.props,
  children: PropTypes.element.isRequired,
};

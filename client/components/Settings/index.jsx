
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Card, CardHeader } from '../library';
import SettingsSubNav from './SettingsSubNav';
import styles from './styles.scss';
import ServicesList from './Services/ServicesList';

export default function Settings(props) {
  const children = React.cloneElement(props.children, { activeAccount: props.activeAccount });
  const { location } = props;

  let showNav = null;

  if (location.pathname === '/settings/services') {
    showNav = (
      <Row className={styles.rowContainer}>
        <Col xs={3} className={styles.subSettingsCol}>
          <Card className={styles.subSettingsCard}>
            <ServicesList />
          </Card>
        </Col>
      </Row>
    );
  } else {
    showNav = (
      <Row className={styles.rowContainer}>
        <Col xs={3} className={styles.subSettingsCol}>
          <Card className={styles.subSettingsCard}>
            <SettingsSubNav location={props.location} />
          </Card>
        </Col>
        <Col xs={9} className={styles.settingsFormsCol} >
          <Card className={styles.settingsFormsCard} >
            {children}
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Grid>
        {showNav}
    </Grid>
  );
}

Settings.propTypes = {
  location: PropTypes.object,
  children: PropTypes.element.isRequired,
};

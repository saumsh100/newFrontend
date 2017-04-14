
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Card, } from '../library';
import SettingsSubNav from './SettingsSubNav';
import styles from './styles.scss';

export default function Settings(props) {
  const children = React.cloneElement(props.children, { activeAccount: props.activeAccount });
  const { location } = props;

  let showNav = null;

  if (location.pathname === '/settings/services' || location.pathname === '/settings/practitioners') {
    showNav = (
      <Row className={styles.rowContainer}>
        {children}
      </Row>
    );
  } else {
    showNav = (
      <Row className={styles.rowContainer}>
        <Col xs={2} className={styles.subSettingsCol}>
          <Card className={styles.subSettingsCard}>
            <SettingsSubNav
              location={props.location}
              className={styles.subSettingsListItem}
            />
          </Card>
        </Col>
        <Col xs={10} className={styles.settingsFormsCol} >
          <Card className={styles.settingsFormsCard} >
            {children}
          </Card>
        </Col>
      </Row>
    );
  }

  // TODO: Remove reliance on Grid Col for separating nav from children (use min-width)

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

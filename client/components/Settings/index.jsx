
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Card, } from '../library';
import SettingsSubNav from './SettingsSubNav';
import styles from './styles.scss';

export default function Settings(props) {
  const { location, children } = props;

  let showNav = null;

  if (location.pathname === '/settings/services' || location.pathname === '/settings/practitioners') {
    showNav = (
      <div className={styles.rowContainer}>
        {children}
      </div>
    );
  } else {
    showNav = (
      <div className={styles.rowContainer}>
        <div className={styles.subSettingsCol}>
          <Card className={styles.subSettingsCard}>
            <SettingsSubNav
              location={props.location}
              className={styles.subSettingsListItem}
            />
          </Card>
        </div>
        <div className={styles.settingsFormsCol} >
          <Card className={styles.settingsFormsCard} >
            {children}
          </Card>
        </div>
      </div>
    );
  }

  // TODO: Remove reliance on Grid Col for separating nav from children (use min-width)

  return (
    <div>
      {showNav}
    </div>
  );
}

Settings.propTypes = {
  location: PropTypes.object,
  children: PropTypes.element.isRequired,
};

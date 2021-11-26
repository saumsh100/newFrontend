
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Card } from '../library';
import SettingsSubNav from './SettingsSubNav';
import styles from './styles.scss';

export default function Settings(props) {
  const { location, children, users } = props;

  let showNav = null;

  if (
    location.pathname === '/settings/reasons' ||
    location.pathname === '/settings/practitioners' ||
    location.pathname === '/settings/forms'
  ) {
    showNav = <div className={styles.rowContainer}>{children}</div>;
  } else {
    showNav = (
      <div className={styles.rowContainer}>
        <div className={styles.subSettingsCol}>
          <Card className={styles.subSettingsCard} noBorder>
            <SettingsSubNav
              location={props.location}
              users={users}
              className={styles.subSettingsListItem}
            />
          </Card>
        </div>
        <div className={styles.settingsFormsCol}>
          <Card className={styles.settingsFormsCard} noBorder>
            {children}
          </Card>
        </div>
      </div>
    );
  }

  return <div>{showNav}</div>;
}

Settings.propTypes = {
  location: PropTypes.objectOf(PropTypes.string).isRequired,
  children: PropTypes.element.isRequired,
  users: PropTypes.instanceOf(Map).isRequired,
};


import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import some from 'lodash/some';
import { Avatar, ListItem } from '../../../../library';
import styles from './styles.scss';

const notAllTrue = obj => some(obj, val => !val);

function DigitalWaitListItem ({ patient, waitSpot }) {
  const { preferences, unavailableDays } = waitSpot.toJS();

  let availComponent = <span>All</span>;
  if (notAllTrue(preferences)) {
    availComponent = preferences.map((val, key) => {
      if (!val) return null;
      return <span>{key}</span>
    });
  }

  let exceptComponent = null;
  if (unavailableDays && unavailableDays.length) {
    exceptComponent = (
      <div>
        <div className={styles.availability}>
          Except
        </div>
        <div className={styles.patients__item_days}>
          <span>10/15</span>
        </div>
      </div>
    );
  }

  return (
    <ListItem className={styles.patients__item}>
      <Avatar size="lg" user={patient.toJS()} />
      <div className={styles.patients__item_wrapper}>
        <div className={styles.patients__item_left}>
          <div className={styles.patients__item_name}>
            <b>{patient.getFullName()}, <span>{patient.getAge()}</span></b>
          </div>
          <div className={styles.patients__item_phone}>
            {patient.get('phoneNumber')}
          </div>
          <div className={styles.patients__item_email}>
            {patient.get('email')}
          </div>
        </div>
      </div>
      <div className={styles.patients__item_right}>
        <div className={styles.availability}>
          Availability
        </div>
        <div className={styles.patients__item_days}>
          {availComponent}
        </div>
        {exceptComponent}
      </div>
    </ListItem>
  );
}

DigitalWaitListItem.propTypes = {
  patient: PropTypes.object.isRequired,
  waitSpot: PropTypes.object.isRequired,
};

export default DigitalWaitListItem;

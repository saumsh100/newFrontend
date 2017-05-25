
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import map from 'lodash/map';
import some from 'lodash/some';
import { Avatar, ListItem } from '../../library';
import styles from './styles.scss';

const notAllTrue = obj => some(obj, val => !val);

function DigitalWaitListItem ({ patient, waitSpot }) {
  const { preferences, unavailableDays } = waitSpot.toJS();

  // Set Availability to All by default and then list selected if not...
  let availComponent = <span className={styles.data}>All</span>;
  if (notAllTrue(preferences)) {
    availComponent = map(preferences, (val, key) => {
      if (!val) return null;
      return <div className={styles.data}>{key}</div>;
    });
  }

  // Set Except to None by default and then list if not empty
  let exceptComponent = <span className={styles.data}>None</span>;
  if (unavailableDays && unavailableDays.length) {
    exceptComponent = unavailableDays.map((val) => {
      return <div className={styles.data}>{moment(val).format('MM/DD')}</div>;
    });
  }

  // The max-width style was not working and so did this for longer names
  let name = patient.getFullName();
  if (name.length > 12) {
    name = `${patient.get('firstName')[0]}. ${patient.get('lastName')}`;
  }

  return (
    <ListItem className={styles.patients__item}>
      <Avatar size="lg" user={patient.toJS()} />
      <div className={styles.patients__item_wrapper}>
        <div className={styles.patients__item_left}>
          <div className={styles.patients__item_name}>
            <b>
              <div className={styles.name}>{name}</div>,
              <span> {patient.getAge()}</span>
            </b>
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
        <div className={styles.availability}>
          Except
        </div>
        <div className={styles.patients__item_days}>
          {exceptComponent}
        </div>
      </div>
    </ListItem>
  );
}

DigitalWaitListItem.propTypes = {
  patient: PropTypes.object.isRequired,
  waitSpot: PropTypes.object.isRequired,
};

export default DigitalWaitListItem;

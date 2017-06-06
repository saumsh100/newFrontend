
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import map from 'lodash/map';
import some from 'lodash/some';
import withHoverable from '../../../hocs/withHoverable';
import { Avatar, ListItem, IconButton, Icon } from '../../library';
import styles from './styles.scss';

const notAllTrue = obj => some(obj, val => !val);

function DigitalWaitListItem(props) {
  const {
    patient,
    waitSpot,
    handlePatientClick,
    setSelectedWaitSpot,
    isHovered,
    removeWaitSpot,
  } = props;

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

  const waitSpotJS = Object.assign({}, waitSpot.toJS(), {
    waitSpotModel: waitSpot,
  });


  let showHoverComponents = (
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
  );

  if (isHovered) {
    showHoverComponents = (
      <div className={styles.patients__item_clickIcons}>
        <IconButton
          icon={'times-circle-o'}
          onClick={(e) => {
            e.stopPropagation();
            removeWaitSpot(waitSpot.get('id'));
          }}
          size={1.2}
        />
        <div className={styles.patients__item_pencilBorder}>
          <Icon
            icon={'pencil'}
            className={styles.patients__item_pencilBorder_pencil}
            onClick={() => setSelectedWaitSpot(waitSpotJS)}
            size={1}
          />
        </div>
      </div>
    );
  }

  return (
    <ListItem className={styles.patients__item} >
      <Avatar size="lg" user={patient.toJS()} />
      <div className={styles.patients__item_wrapper}>
        <div className={styles.patients__item_left}>
          <div className={styles.patients__item_name}>
            <a
              className={styles.patients__item_name}
              onClick={(e) => {
                e.stopPropagation();
                handlePatientClick(patient.id);
              }}
              href="#"
            >
              <b>
                <span className={styles.name}>{name}</span>,
                <span> {patient.getAge()}</span>
              </b>
            </a>
          </div>
          <div className={styles.patients__item_phone}>
            {patient.get('mobilePhoneNumber')}
          </div>
          <div className={styles.patients__item_email}>
            {patient.get('email')}
          </div>
        </div>
      </div>
      {showHoverComponents}
    </ListItem>
  );
}

DigitalWaitListItem.propTypes = {
  patient: PropTypes.object.isRequired,
  waitSpot: PropTypes.object.isRequired,
};

export default withHoverable(DigitalWaitListItem);

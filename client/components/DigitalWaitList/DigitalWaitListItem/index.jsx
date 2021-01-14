
import PropTypes from 'prop-types';
import React from 'react';
import map from 'lodash/map';
import some from 'lodash/some';
import { connect } from 'react-redux';
import withHoverable from '../../../hocs/withHoverable';
import { Avatar, ListItem, IconButton, Icon, getFormattedDate } from '../../library';
import styles from './styles.scss';

const notAllTrue = obj => some(obj, val => !val);
const notAllFalse = obj => some(obj, val => val);

const DigitalWaitListItem = ({
  patientUser,
  waitSpot,
  setSelectedWaitSpot,
  isHovered,
  removeWaitSpot,
  index,
  timezone,
}) => {
  if (!patientUser) {
    return null;
  }

  const { preferences, daysOfTheWeek } = waitSpot.toJS();

  // Set Availability to All by default and then list selected if not...
  let availComponent = <span className={styles.data}>All</span>;
  if (notAllTrue(preferences)) {
    availComponent = map(preferences, (val, key) => {
      if (!val) return null;
      return (
        <div key={key} className={styles.data}>
          {key}
        </div>
      );
    });
  }

  // Set Availability to All by default and then list selected if not...
  let daysComponent = <span className={styles.data}>None</span>;
  if (notAllFalse(daysOfTheWeek)) {
    daysComponent = map(daysOfTheWeek, (val, key) => {
      if (!val) return null;
      return (
        <div key={key} className={styles.data}>
          {key.slice(0, 3)}
        </div>
      );
    });
  }

  // The max-width style was not working and so did this for longer names
  let name = patientUser.getFullName();
  if (name.length > 12) {
    name = `${patientUser.get('firstName')[0]}. ${patientUser.get('lastName')}`;
  }

  const waitSpotJS = Object.assign({}, waitSpot.toJS(), {
    waitSpotModel: waitSpot,
  });

  let showHoverComponents = (
    <div className={styles.patients__item_right}>
      <div className={styles.availability}>Preferred Timeframe</div>
      <div className={styles.patients__item_days}>{availComponent}</div>
      <div className={styles.availability}>Preferred Days</div>
      <div className={styles.patients__item_days}>{daysComponent}</div>
    </div>
  );

  if (isHovered) {
    showHoverComponents = (
      <div className={styles.patients__item_clickIcons}>
        <IconButton
          icon="times-circle-o"
          onClick={(e) => {
            e.stopPropagation();
            removeWaitSpot(waitSpot.get('id'));
          }}
          size={1.2}
        />
        <div
          className={styles.patients__item_pencilBorder}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedWaitSpot(waitSpotJS);
          }}
          role="button"
          tabIndex={index}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              e.stopPropagation();
              setSelectedWaitSpot(waitSpotJS);
            }
          }}
        >
          <Icon icon="pencil" className={styles.patients__item_pencilBorder_pencil} size={0.9} />
        </div>
      </div>
    );
  }

  return (
    <ListItem key={index} className={styles.patients__item} data-test-id={`${index}_waitList`}>
      <Avatar size="md" user={patientUser.toJS()} />
      <div className={styles.patients__item_wrapper}>
        <div className={styles.patients__item_left}>
          <div className={styles.patients__item_endDate}>
            {getFormattedDate(waitSpot.get('endDate'), 'MMMM Do YYYY, h:mm a', timezone)}
          </div>
          <div className={styles.patients__item_name}>
            <span className={styles.name}>{name}</span>
          </div>
          <div className={styles.patients__item_phone}>{patientUser.get('phoneNumber')}</div>
          <div className={styles.patients__item_email}>{patientUser.get('email')}</div>
        </div>
      </div>
      {showHoverComponents}
    </ListItem>
  );
};

DigitalWaitListItem.propTypes = {
  patientUser: PropTypes.instanceOf(Map).isRequired,
  waitSpot: PropTypes.instanceOf(Map).isRequired,
  setSelectedWaitSpot: PropTypes.func.isRequired,
  isHovered: PropTypes.bool,
  removeWaitSpot: PropTypes.func.isRequired,
  index: PropTypes.number,
  timezone: PropTypes.string.isRequired,
};

DigitalWaitListItem.defaultProps = {
  isHovered: false,
  index: 0,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

const DigitalWaitListItemWrapper = withHoverable(DigitalWaitListItem);
export default connect(mapStateToProps)(DigitalWaitListItemWrapper);

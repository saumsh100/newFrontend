
import React, { PropTypes } from 'react';
import moment from 'moment';
import styles from '../styles.scss';

function AvailabilitiesDisplay(props) {
  const {
    startsAt,
    availabilities,
    onSelect,
    onSixDaysBack,
    onSixDaysForward,
  } = props;

  return (
    <div className={styles.appointment__table} onClick={onSelect}>
      <button className={styles.appointment__table_btn} onClick={onSixDaysBack}>
        <i className="fa fa-arrow-circle-o-left" />
      </button>
      <div className={styles.appointment__table_elements}>
        {availabilities.map((av) => {
          return (
            <ul className={styles.appointment__list} key={av.date}>
              <div className={styles.appointment__list_header}>
                <div className={styles.list__header_day}>
                  {moment(av.date).format('ddd')}
                </div>
                <div className={styles.list__header_number}>
                  {moment(av.date).format('DD/MM/YYYY')}
                </div>
              </div>
              {av.availabilities.map((slot) => {
                return (
                  <li
                    key={slot.startsAt}
                    onClick={() => onSelect(slot)}
                    className={`${styles.appointment__list_item} ${slot.isBusy ? styles.appointment__list_active : ''} ${slot.startsAt === startsAt ? styles.appointment__list_selected : ''}`}
                  >
                    {moment(slot.startsAt).format('HH:mm A')}
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>
      <button className={styles.appointment__table_btn} onClick={onSixDaysForward}>
        <i className="fa fa-arrow-circle-o-right" />
      </button>
    </div>
  );

  // TODO: change Left/Right Buttons to Button elements with Icons
  // TODO: break out the availabilities component into columns and lists
}

AvailabilitiesDisplay.propTypes = {
  //startsAt: PropTypes.prop,
  availabilities: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func.isRequired,
  onSixDaysBack: PropTypes.func.isRequired,
  onSixDaysForward: PropTypes.func.isRequired,
};

export default AvailabilitiesDisplay;

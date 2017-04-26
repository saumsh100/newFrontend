
import React, { PropTypes } from 'react';
import moment from 'moment';
import { IconButton } from '../../../library';
import styles from './styles.scss';

const getSortedAvailabilities = (momentDate, availabilities) => {
  const filteredAvailabilities = availabilities.filter(a => moment(a.startDate).isSame(momentDate, 'd'));
  const sortedAvailabilities = filteredAvailabilities.sort((a, b) => a.diff(b));
  return sortedAvailabilities;
};


function AvailabilitiesDisplay(props) {
  const {
    // startDate,
    // availabilities,
    onSelect,
    onSixDaysBack,
    onSixDaysForward,
  } = props;

  const numDaysForward = 4;
  const dayAvailabilities = [];

  const availabilities = [];
  const startDate = new Date();

  let i;
  for (i = 0; i <= numDaysForward; i++) {
    const momentDate = moment(startDate).add(i, 'days');
    const sortedAvailabilities = getSortedAvailabilities(momentDate, availabilities);
    dayAvailabilities.push({ momentDate, sortedAvailabilities });
  }

  return (
    <div className={styles.appointment__table} onClick={onSelect}>
      <IconButton
        icon="arrow-circle-o-left"
        className={styles.appointment__table_btn}
        onClick={onSixDaysForward}
      />
      <div className={styles.appointment__table_elements}>
        {dayAvailabilities.map((a) => {
          return (
            <ul className={styles.appointment__list} key={a.startDate}>
              <div className={styles.appointment__list_header}>
                <div className={styles.list__header_day}>
                  {a.momentDate.format('ddd')}
                </div>
                <div className={styles.list__header_number}>
                  {a.momentDate.format('DD/MM/YYYY')}
                </div>
              </div>
              {a.sortedAvailabilities.map((slot) => {
                return (
                  <li
                    key={slot.startsAt}
                    onClick={() => onSelect(slot)}
                    className={`${styles.appointment__list_item} ${slot.isBusy ? styles.appointment__list_active : ''} ${slot.startDate === startsAt ? styles.appointment__list_selected : ''}`}
                  >
                    {moment(slot.startDate).format('HH:mm A')}
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>
      <IconButton
        icon="arrow-circle-o-right"
        className={styles.appointment__table_btn}
        onClick={onSixDaysForward}
      />
    </div>
  );

  // TODO: change Left/Right Buttons to Button elements with Icons
  // TODO: break out the availabilities component into columns and lists
}

AvailabilitiesDisplay.propTypes = {
  // startsAt: PropTypes.prop,
  availabilities: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func.isRequired,
  onSixDaysBack: PropTypes.func.isRequired,
  onSixDaysForward: PropTypes.func.isRequired,
};

export default AvailabilitiesDisplay;

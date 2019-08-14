
import React from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import { dateFormatter, capitalize } from '@carecru/isomorphic';
import classNames from 'classnames';
import styles from './single-date.scss';
import GearIcon from '../ui-kit/Icons/Gear';

const DateSchedule = ({ day, schedule, timezone, handleEditSchedule, shouldDisplayWeeklyHours }) =>
  shouldDisplayWeeklyHours && (
    <div
      className={classNames(styles.scheduleWrapper, {
        [styles.scheduleFeatured]: schedule.isFeatured,
        [styles.scheduleOverride]: schedule.isDailySchedule,
      })}
      onClick={() => handleEditSchedule(day)}
      role="button"
      tabIndex={0}
      key={schedule.id}
      onKeyDown={e => e.keyCode === '13' && handleEditSchedule(day)}
    >
      <div className={styles.info}>
        <div className={styles.schedule}>
          <div className={styles.date}>{capitalize(day)}</div>
          <div className={styles.times}>
            {schedule.isClosed
              ? 'CLOSED'
              : `${dateFormatter(schedule.startTime, timezone, 'LT')} to ${dateFormatter(
                  schedule.endTime,
                  timezone,
                  'LT',
                )}`}
          </div>
        </div>
        <div className={styles.breaks}>
          <div className={styles.breakTitle}>Breaks</div>
          <ul className={styles.breakList}>
            {schedule.breaks.length > 0
              ? schedule.breaks.map(br => (
                  <li key={uuid()}>
                    {`${dateFormatter(br.startTime, timezone, 'LT')} to ${dateFormatter(
                      br.endTime,
                      timezone,
                      'LT',
                    )}`}
                  </li>
                ))
              : '--'}
          </ul>
          <span className={styles.spacer} />
        </div>
      </div>
      <div className={styles.edit}>
        <GearIcon />
      </div>
    </div>
  );

DateSchedule.propTypes = {
  handleEditSchedule: PropTypes.func.isRequired,
  day: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  shouldDisplayWeeklyHours: PropTypes.bool.isRequired,
  schedule: PropTypes.shape({
    breaks: PropTypes.array,
    isClosed: PropTypes.bool,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }).isRequired,
};

export default DateSchedule;

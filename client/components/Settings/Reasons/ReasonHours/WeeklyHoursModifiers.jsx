import React from 'react';
import PropTypes from 'prop-types';
import ScheduleModifier from './ScheduleModifier';
import styles from './styles.scss';
import { parseDateWithFormat } from '../../../library/util/datetime';
import { timeToVerticalPosition } from '../../../library/util/datetime/helpers';

const h2px = 75;
const m2px = h2px / 60;
const AVAILABILITIES = 'availabilities';

const timeToVerticalPositionBuilder = ({ timezone, rangeStartTime, time, allowedTimeFormat }) =>
  timeToVerticalPosition(
    {
      time,
      formats: allowedTimeFormat,
    },
    timezone,
    m2px,
    rangeStartTime,
  );

/**
 * Gets a modifier height based on the difference between the endTime and the startTime positions,
 * if it's not a break we can calculate the height based on the duration of the reason.
 *
 * @param modifierKey
 * @param endTime
 * @param startTime
 * @param duration
 * @param props
 * @return {number}
 */
const getModifierHeight = (modifierKey, endTime, startTime, { duration, ...props }) =>
  modifierKey === AVAILABILITIES
    ? duration * m2px
    : timeToVerticalPositionBuilder({
        ...props,
        time: endTime,
      }) -
      timeToVerticalPositionBuilder({
        ...props,
        time: startTime,
      });

const WeeklyHoursModifiers = ({ modifiers, ...props }) => {
  if (!Object.values(modifiers.breaks).length && !Object.values(modifiers.availabilities).length) {
    return null;
  }

  return (
    <div className={styles.modifiers}>
      {Object.entries(modifiers).map(([modifierKey, values]) =>
        Object.values(values).map(({ startTime, endTime }) => (
          <ScheduleModifier
            type={modifierKey}
            startTime={startTime}
            top={timeToVerticalPositionBuilder({
              ...props,
              time: startTime,
            })}
            value={parseDateWithFormat(startTime, props.allowedTimeFormat, props.timezone).format(
              'LT',
            )}
            height={getModifierHeight(modifierKey, endTime, startTime, props)}
            label={modifierKey === AVAILABILITIES ? 'Set Availability' : 'Blocked'}
          />
        )),)}
    </div>
  );
};

WeeklyHoursModifiers.propTypes = {
  duration: PropTypes.number.isRequired,
  timezone: PropTypes.string.isRequired,
  rangeStartTime: PropTypes.number.isRequired,
  allowedTimeFormat: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string])
    .isRequired,
  modifiers: PropTypes.shape({
    availabilities: PropTypes.arrayOf(
      PropTypes.shape({
        startTime: PropTypes.string,
        endTime: PropTypes.string,
      }),
    ),
    breaks: PropTypes.arrayOf(
      PropTypes.shape({
        startTime: PropTypes.string,
        endTime: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default WeeklyHoursModifiers;

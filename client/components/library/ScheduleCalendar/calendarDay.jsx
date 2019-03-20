
import React from 'react';
import { setDateToTimezone } from '@carecru/isomorphic';
import classNames from 'classnames';
import styles from './day.scss';

const formatTimeToTz = (value, timezone) => {
  const valueInstance = setDateToTimezone(value, timezone);
  const format = valueInstance.minutes() === 0 ? 'h' : 'h:mm';
  return valueInstance.format(format);
};

const generateHours = (startTime, endTime, breaks, timezone) => {
  const startTZ = formatTimeToTz(startTime, timezone);
  const endTZ = formatTimeToTz(endTime, timezone);

  if (breaks.length === 0) {
    return [{ startTime: startTZ,
      endTime: endTZ }];
  }

  const sanitizedBreaks = breaks
    .sort(({ startTime: a }, { startTime: b }) => b < a)
    .map(bk => ({
      startTime: formatTimeToTz(bk.startTime, timezone),
      endTime: formatTimeToTz(bk.endTime, timezone),
    }));
  const result = [];

  for (let i = 0; i < sanitizedBreaks.length; i += 1) {
    if (i === 0) {
      result.push({ startTime: startTZ });
    }

    result[i].endTime = sanitizedBreaks[i].startTime;
    result.push({ startTime: sanitizedBreaks[i].endTime });

    if (i === sanitizedBreaks.length - 1) {
      result[i + 1].endTime = endTZ;
    }
  }
  return result;
};

const calendarDay = (
  day,
  handleEditSchedule,
  { isClosed, startTime, endTime, breaks, isDailySchedule },
  timezone,
) => (
  <div
    className={styles.cell}
    onDoubleClick={(e) => {
      e.stopPropagation();
      handleEditSchedule();
    }}
  >
    <div className={classNames(styles.single, { [styles.dailySingle]: isDailySchedule })}>
      {day.getDate()}
    </div>
    {!!startTime && !!endTime && (
      <div className={styles.hours}>
        {isClosed ? (
          <span>CLOSED</span>
        ) : (
          <div className={styles.breaks}>
            {generateHours(startTime, endTime, breaks, timezone).map(opening => (
              <span>{`${opening.startTime} - ${opening.endTime}`}</span>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

export default calendarDay;

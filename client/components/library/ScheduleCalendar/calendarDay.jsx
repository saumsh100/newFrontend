
import React from 'react';
import { dateFormatter } from '@carecru/isomorphic';
import classNames from 'classnames';
import styles from './day.scss';

const formatTimeToTz = (value, timezone) => dateFormatter(value, timezone, 'LT');

const generateHours = (startTime, endTime, breaks, timezone) => {
  const defaultHours = [
    { startTime: formatTimeToTz(startTime, timezone),
      endTime: formatTimeToTz(endTime, timezone) },
  ];

  if (breaks.length === 0) {
    return defaultHours;
  }

  const sortedBreaks = breaks.sort(
    ({ startTime: a }, { startTime: b }) => new Date(a) - new Date(b),
  );

  const operationHours = [];

  operationHours[0] = { startTime,
    endTime: sortedBreaks[0].startTime };

  operationHours[sortedBreaks.length] = {
    startTime: sortedBreaks[sortedBreaks.length - 1].endTime,
    endTime,
  };

  for (let i = 0; i < sortedBreaks.length - 1; i += 1) {
    operationHours[i + 1] = {
      startTime: sortedBreaks[i].endTime,
      endTime: sortedBreaks[i + 1].startTime,
    };
  }

  return operationHours
    .filter(
      ({ startTime: a, endTime: b }) =>
        // filter out starting hours that's after endTime and ending hours before startTime
        new Date(a) < new Date(endTime) && new Date(b) > new Date(startTime),
    )
    .map(rs => ({
      startTime: formatTimeToTz(rs.startTime, timezone),
      endTime: formatTimeToTz(rs.endTime, timezone),
    }));
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

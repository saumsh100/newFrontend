
import React from 'react';
import classNames from 'classnames';
import styles from './day.scss';
import { getUTCDate } from '../util/datetime';

const generateHours = (startTime, endTime, breaks, timezone) => {
  const defaultHours = [
    {
      startTime: getUTCDate(startTime, timezone).format('LT'),
      endTime: getUTCDate(endTime, timezone).format('LT'),
    },
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
      startTime: getUTCDate(rs.startTime, timezone).format('LT'),
      endTime: getUTCDate(rs.endTime, timezone).format('LT'),
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


import React from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import { dateFormatter } from '@carecru/isomorphic';
import classNames from 'classnames';
import DateSchedule from './DateSchedule';
import { Button } from '../';
import EnabledFeature from '../EnabledFeature';
import styles from './drawer.scss';

const ScheduleDrawer = ({
  schedule,
  isOverride,
  timezone,
  selectedDay,
  toggleCustomSchedule,
  shouldDisplayWeeklyHours,
  handleEditSchedule,
}) => (
  <div className={styles.wrapper}>
    <div className={styles.top}>
      <h2 className={styles.title}>
        {selectedDay
          ? dateFormatter(selectedDay, timezone, 'MMM. D, YYYY')
          : 'Default Weekly Schedule'}
      </h2>
      <div className={styles.toggle}>
        <EnabledFeature
          predicate={() => !!selectedDay}
          render={({ flags }) => {
            const dailyCreationRule = selectedDay
              ? flags.get('connector-create-practitioner-dailySchedules')
              : flags.get('connector-create-practitioner-weeklySchedule');
            const dailyDeletionRule = selectedDay
              ? flags.get('connector-delete-practitioner-dailySchedules')
              : flags.get('connector-delete-practitioner-weeklySchedule');
            const isAllow = isOverride ? dailyDeletionRule : dailyCreationRule;
            return (
              <Button
                onClick={() => isAllow && toggleCustomSchedule(isOverride)}
                disabled={!isAllow}
                className={classNames(styles.override, {
                  [styles.active]: isOverride && isAllow,
                  [styles.disabled]: !isAllow,
                })}
              >
                {isOverride ? 'Delete' : 'Create'} Holiday Hours
              </Button>
            );
          }}
        />
      </div>
    </div>
    <div className={styles.schedules}>
      {Object.entries(schedule).map(([day, sc]) => (
        <DateSchedule
          day={day}
          schedule={sc}
          key={uuid()}
          timezone={timezone}
          shouldDisplayWeeklyHours={shouldDisplayWeeklyHours}
          handleEditSchedule={handleEditSchedule}
        />
      ))}
    </div>
  </div>
);

ScheduleDrawer.propTypes = {
  handleEditSchedule: PropTypes.func.isRequired,
  isOverride: PropTypes.bool.isRequired,
  schedule: PropTypes.objectOf(PropTypes.shape({
    breaks: PropTypes.array,
    chairIds: PropTypes.array,
    endTime: PropTypes.string,
    isClosed: PropTypes.bool,
    isDailySchedule: PropTypes.bool,
    isFeatured: PropTypes.bool,
    startTime: PropTypes.string,
  })),
  selectedDay: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  shouldDisplayWeeklyHours: PropTypes.bool.isRequired,
  timezone: PropTypes.string.isRequired,
  toggleCustomSchedule: PropTypes.func.isRequired,
};

ScheduleDrawer.defaultProps = {
  schedule: {},
  selectedDay: null,
};

export default ScheduleDrawer;

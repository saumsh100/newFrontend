import React from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DateSchedule from './DateSchedule';
import { Button, Icon } from '../index';
import EnabledFeature from '../EnabledFeature';
import styles from './drawer.scss';
import { getFormattedDate } from '../util/datetime';

const ScheduleDrawer = ({
  schedule,
  isOverride,
  timezone,
  selectedDay,
  toggleCustomSchedule,
  shouldDisplayWeeklyHours,
  handleEditSchedule,
  toggleDrawer,
}) => (
  <div className={styles.wrapper}>
    <div className={styles.top}>
      <h2 className={styles.title}>
        <button type="button" className={styles.drawerBackButton} onClick={() => toggleDrawer()}>
          <Icon size={1} icon="chevron-left" className={styles.mainText_iconWrapper} />
          Back
        </button>
        {isOverride && selectedDay ? (
          <p className={styles.mainText_text}>
            Holiday Hours {getFormattedDate(selectedDay, 'MMM. D, YYYY', timezone, true)}
          </p>
        ) : (
          <p className={styles.mainText_text}>Default Weekly Schedule</p>
        )}
      </h2>
      <div>
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
                icon={isOverride ? 'trash' : 'plus'}
                className={classNames({
                  [styles.active]: isOverride && isAllow,
                  [styles.disabled]: !isAllow,
                  [styles.trashIcon]: isOverride,
                })}
              >
                {isOverride ? 'Delete' : 'Holiday Hours'}
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
  schedule: PropTypes.objectOf(
    PropTypes.shape({
      breaks: PropTypes.arrayOf(PropTypes.any),
      chairIds: PropTypes.arrayOf(PropTypes.string),
      endTime: PropTypes.string,
      isClosed: PropTypes.bool,
      isDailySchedule: PropTypes.bool,
      isFeatured: PropTypes.bool,
      startTime: PropTypes.string,
    }),
  ),
  selectedDay: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  shouldDisplayWeeklyHours: PropTypes.bool.isRequired,
  timezone: PropTypes.string.isRequired,
  toggleCustomSchedule: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

ScheduleDrawer.defaultProps = {
  schedule: {},
  selectedDay: null,
};

export default ScheduleDrawer;

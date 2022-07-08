import React from 'react';
import PropTypes from 'prop-types';
import EnabledFeature from '../../../../library/EnabledFeature';
import { Toggle } from '../../../../library';
import styles from '../../../../library/ScheduleCalendar/day.scss';

const SetCustom = ({ baseSchedule, handleCreateCustomSchedule, handleRemoveOverrideHours }) => {
  return (
    <EnabledFeature
      predicate={() => true}
      render={({ flags }) => {
        const isAllow = baseSchedule.isCustomSchedule
          ? flags.get('connector-delete-practitioner-weeklySchedule')
          : flags.get('connector-create-practitioner-weeklySchedule');
        return (
          <div className={styles.customScheduleWrapper}>
            <span>Set Custom</span>
            <Toggle
              disabled={!isAllow}
              checked={baseSchedule.isCustomSchedule}
              onChange={(e) => {
                if (e.target.checked) {
                  return handleCreateCustomSchedule();
                }
                return handleRemoveOverrideHours();
              }}
            />
          </div>
        );
      }}
    />
  );
};

SetCustom.propTypes = {
  baseSchedule: PropTypes.shape({
    isCustomSchedule: PropTypes.bool,
  }).isRequired,
  handleCreateCustomSchedule: PropTypes.func.isRequired,
  handleRemoveOverrideHours: PropTypes.func.isRequired,
};

export default SetCustom;

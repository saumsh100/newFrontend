
import React, { memo, useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DayOfWeekSegment from './FilterSegments/DayOfWeekSegment';
import ReasonSegment from './FilterSegments/ReasonSegment';
import UnitSegment from './FilterSegments/UnitSegment';
import { DEFAULT_DAY_OF_WEEK, DEFAULT_REASONS, DEFAULT_UNITS_RANGE } from './consts';
import { applyAllFilters } from './filterFunctions';
import styles from './styles.scss';
import TimesSegment from './FilterSegments/TimesSegment';
import { generatePractitionersFilter, generateTimesFilter } from '../helpers';
import { sortPractitionersAlphabetical } from '../../../../Utils';

const FilterBar = ({
  updateSegmentedWaitList,
  waitlist,
  timezone,
  practitioners,
  setIsFilterActive,
}) => {
  const [filterRules, setFilterRules] = useState({
    reasons: {
      rule: DEFAULT_REASONS,
      isActive: false,
      showNotSet: false,
    },
    practitioners: {
      rule: generatePractitionersFilter(practitioners),
      isActive: false,
      showNotSet: false,
    },
    units: {
      rule: DEFAULT_UNITS_RANGE,
      isActive: false,
      showNotSet: false,
    },
    dayOfWeek: {
      rule: DEFAULT_DAY_OF_WEEK,
      isActive: false,
      showNotSet: false,
    },
    times: {
      rule: generateTimesFilter(timezone),
      isActive: false,
      showNotSet: true,
    },
  });

  const updateFilterRule = useCallback((key, val) => {
    setFilterRules(prev => ({
      ...prev,
      [key]: val,
    }));
  }, []);

  useEffect(() => {
    const isFilterActive = Object.keys(filterRules).filter(filter => filterRules[filter].isActive)
      .length;

    setIsFilterActive(!!isFilterActive);
  }, [filterRules, setIsFilterActive]);

  useEffect(() => {
    const filteredWaitList = applyAllFilters(waitlist, filterRules);
    updateSegmentedWaitList(filteredWaitList);
  }, [filterRules, waitlist, updateSegmentedWaitList]);

  return (
    <div className={styles.filterBarWrapper}>
      <div className={styles.segmentWrapper}>
        <ReasonSegment
          selectedReasons={filterRules.reasons}
          updateReasons={val => updateFilterRule('reasons', val)}
        />
      </div>
      <div className={styles.segmentWrapper}>
        <UnitSegment
          unitsRule={filterRules.units}
          updateUnitsRule={val => updateFilterRule('units', val)}
        />
      </div>
      <div className={styles.segmentWrapper}>
        <DayOfWeekSegment
          selectedDayOfWeek={filterRules.dayOfWeek}
          updateDayOfWeek={val => updateFilterRule('dayOfWeek', val)}
        />
      </div>
      <div className={styles.segmentWrapper}>
        <TimesSegment
          timesRule={filterRules.times}
          updateSelectedTimes={val => updateFilterRule('times', val)}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth, entities }) => ({
  account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
  practitioners: entities
    .getIn(['practitioners', 'models'])
    .sort(sortPractitionersAlphabetical)
    .toArray()
    .filter(practitioner => practitioner.isActive)
    .map(practitioner => ({
      id: practitioner.get('id'),
      label: practitioner.getPrettyName(),
    })),
});

export default memo(connect(mapStateToProps)(FilterBar));

FilterBar.propTypes = {
  updateSegmentedWaitList: PropTypes.func.isRequired,
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  timezone: PropTypes.string.isRequired,
  practitioners: PropTypes.instanceOf(Map),
  setIsFilterActive: PropTypes.func.isRequired,
};

FilterBar.defaultProps = {
  practitioners: null,
};

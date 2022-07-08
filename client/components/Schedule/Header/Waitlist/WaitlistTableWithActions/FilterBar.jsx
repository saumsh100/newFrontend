import React, { memo, useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DayOfWeekSegment from './FilterSegments/DayOfWeekSegment';
import ReasonSegment from './FilterSegments/ReasonSegment';
import PractitionersSegment from './FilterSegments/PractitionersSegment';
import UnitSegment from './FilterSegments/UnitSegment';
import WaitlistSearch from './FilterSegments/WaitlistSearch';
import { DEFAULT_DAY_OF_WEEK, DEFAULT_REASONS, DEFAULT_UNITS_RANGE, NOT_SET_LABEL } from './consts';
import { applyAllFilters, dayOfWeekFilter, patientSearch } from './filterFunctions';
import TimesSegment from './FilterSegments/TimesSegment';
import { generatePractitionersFilter, generateTimesFilter } from '../helpers';
import { sortPractitionersAlphabetical } from '../../../../Utils';
import styles from './reskin-styles.scss';
import { practitionerShape } from '../../../../library/PropTypeShapes';

/* eslint-disable react-hooks/exhaustive-deps */
const FilterBar = ({
  updateSegmentedWaitList,
  waitlist,
  segmentedWaitList,
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
      // TODO: use office hours instead of fixed time
      rule: generateTimesFilter(timezone),
      isActive: false,
      showNotSet: true,
    },
  });

  const [searchQuery, setSearchQuery] = useState('');

  const updateFilterRule = (key, val) => {
    setFilterRules((prev) => {
      if (!prev[key] || !prev[key] !== val) {
        return {
          ...prev,
          [key]: val,
        };
      }
      return prev;
    });
  };

  const rowCountByDayOfWeek = useMemo(() => {
    const dayOfWeekKeys = Object.keys(DEFAULT_DAY_OF_WEEK);
    const EveryDayOfWeek = dayOfWeekKeys.map((day) => ({
      ...DEFAULT_DAY_OF_WEEK,
      [day]: true,
    }));

    const countByDay = Object.fromEntries(
      EveryDayOfWeek.map((val, index) => {
        const day = Object.keys(val)[index];
        const count = dayOfWeekFilter(segmentedWaitList, val, false).length;
        return [day, count];
      }),
    );

    return {
      ...countByDay,
      [NOT_SET_LABEL]: dayOfWeekFilter(segmentedWaitList, DEFAULT_DAY_OF_WEEK, true).length,
    };
  }, [segmentedWaitList]);

  useEffect(() => {
    const activeFilterRules = Object.keys(filterRules).filter(
      (filter) => filterRules[filter].isActive,
    );
    const isSearchFilterActive = !!searchQuery;
    const isFilterActive = activeFilterRules.length || isSearchFilterActive;
    setIsFilterActive(!!isFilterActive);
  }, [filterRules, setIsFilterActive, searchQuery]);

  useEffect(() => {
    const filteredWaitList = applyAllFilters(waitlist, filterRules);
    const searchedWaitList = patientSearch(filteredWaitList, searchQuery);
    updateSegmentedWaitList(searchedWaitList);
  }, [filterRules, waitlist, updateSegmentedWaitList, searchQuery]);

  const updateReasons = useMemo(() => (val) => updateFilterRule('reasons', val), []);
  const updatePractitioners = useMemo(() => (val) => updateFilterRule('practitioners', val), []);
  const updateUnitsRule = useMemo(() => (val) => updateFilterRule('units', val), []);
  const updateDayOfWeek = useMemo(() => (val) => updateFilterRule('dayOfWeek', val), []);
  const updateSelectedTimes = useMemo(() => (val) => updateFilterRule('times', val), []);

  return (
    <>
      <WaitlistSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className={styles.filterBarWrapper}>
        <div className={styles.segmentWrapper}>
          <ReasonSegment selectedReasons={filterRules.reasons} updateReasons={updateReasons} />
        </div>
        <div className={styles.segmentWrapper}>
          <PractitionersSegment
            practitionerRule={filterRules.practitioners}
            updatePractitioners={updatePractitioners}
          />
        </div>
        <div className={styles.segmentWrapper}>
          <UnitSegment unitsRule={filterRules.units} updateUnitsRule={updateUnitsRule} />
        </div>
        <div className={styles.segmentWrapper}>
          <DayOfWeekSegment
            selectedDayOfWeek={filterRules.dayOfWeek}
            updateDayOfWeek={updateDayOfWeek}
            rowCountByDayOfWeek={rowCountByDayOfWeek}
          />
        </div>
        <div className={styles.segmentWrapper}>
          <TimesSegment timesRule={filterRules.times} updateSelectedTimes={updateSelectedTimes} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ auth, entities }) => ({
  practitioners: entities
    .getIn(['practitioners', 'models'])
    .sort(sortPractitionersAlphabetical)
    .toArray()
    .filter((practitioner) => practitioner.isActive)
    .map((practitioner) => ({
      id: practitioner.get('id'),
      label: practitioner.getPrettyName(),
    })),
  timezone: auth.get('timezone'),
});

export default memo(connect(mapStateToProps)(FilterBar));

FilterBar.propTypes = {
  updateSegmentedWaitList: PropTypes.func.isRequired,
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  segmentedWaitList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  timezone: PropTypes.string.isRequired,
  practitioners: PropTypes.arrayOf(PropTypes.shape(practitionerShape)),
  setIsFilterActive: PropTypes.func.isRequired,
};

FilterBar.defaultProps = {
  practitioners: null,
};

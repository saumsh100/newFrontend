import React, { useMemo, useState, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { week, capitalize } from '../../../../../../util/isomorphic';
import { convertArrayOfOptionsInMap, getDayPickers } from '../../helpers';
import SegmentButton from '../../../../../library/SegmentButton';
import MultiSelect from '../../../../../library/ui-kit/MultiSelect';
import { NOT_SET_VALUE, NOT_SET_LABEL, DEFAULT_DAY_OF_WEEK } from '../consts';
import CustomMultiSelectLabel from './customComponents/customMultiSelectLabel';
import styles from './reskin-styles.scss';

const DayOfWeekSegment = ({ selectedDayOfWeek, updateDayOfWeek, rowCountByDayOfWeek }) => {
  const { rule: dayOfWeekFilter, showNotSet, isActive } = selectedDayOfWeek;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const selectedDaysArr = Object.entries(dayOfWeekFilter)
    .filter(([, v]) => v)
    .map(([v]) => v);
  const selectedDaysArrWithUnSet = showNotSet
    ? selectedDaysArr.concat([NOT_SET_VALUE])
    : selectedDaysArr;
  const isDirty = selectedDaysArrWithUnSet.length > 0;
  const allWeekDays = useMemo(
    () =>
      week.all
        .map((day) => ({
          value: day,
          label: (
            <CustomMultiSelectLabel count={rowCountByDayOfWeek[day]}>
              {capitalize(day)}
            </CustomMultiSelectLabel>
          ),
        }))
        .concat([
          {
            value: NOT_SET_VALUE,
            label: (
              <CustomMultiSelectLabel count={rowCountByDayOfWeek[NOT_SET_LABEL]}>
                {NOT_SET_LABEL}
              </CustomMultiSelectLabel>
            ),
          },
        ]),
    [rowCountByDayOfWeek],
  );

  const onDaysOfTheWeekChange = (values) => {
    setSelectedOptions(values);
    const days = values.filter((v) => v !== NOT_SET_VALUE);
    const payload = {
      rule: convertArrayOfOptionsInMap(days, DEFAULT_DAY_OF_WEEK),
      isActive: values.length !== 0,
      showNotSet: values.includes(NOT_SET_VALUE),
    };
    updateDayOfWeek(payload);
  };

  const onToggleDayPicker = (key) => {
    const allChecked = week[key].every((day) => selectedDaysArr.includes(day));
    const newValue = selectedDaysArr.filter((day) => !week[key].includes(day));
    if (allChecked) {
      onDaysOfTheWeekChange(newValue);
    } else {
      onDaysOfTheWeekChange([...newValue, ...week[key]]);
    }
  };

  function generateSegmentButtonText() {
    const selectedOptionsCapitalized = selectedOptions.map((option) => capitalize(option));
    const noSetSelected = selectedOptionsCapitalized.includes(capitalize(NOT_SET_VALUE));
    const selectedOptionsLength = selectedOptionsCapitalized.length;
    const selectedDays = selectedOptionsCapitalized.filter((v) => v !== NOT_SET_VALUE);

    if (selectedOptionsLength === 0) {
      return 'Days';
    }

    if (selectedOptionsLength === 1) {
      return noSetSelected
        ? `Days ${selectedOptionsCapitalized[0]}`
        : selectedOptionsCapitalized[0];
    }

    if (selectedDays.length === allWeekDays.filter((v) => v.value !== NOT_SET_VALUE).length) {
      return 'All Days';
    }

    return selectedOptionsCapitalized.join(' + ');
  }

  return (
    <MultiSelect
      onChange={onDaysOfTheWeekChange}
      options={allWeekDays}
      selected={selectedDaysArrWithUnSet}
      defaultValue={selectedDaysArrWithUnSet}
      theme={{ listWrapper: classNames(styles.alignRight, styles.listWrapper) }}
      selector={(disabled, selectedItems, error, getToggleButtonProps) => {
        const toggleButtonProps = getToggleButtonProps();
        const activeState = toggleButtonProps['aria-expanded'] && 'active';
        const dirtyState = isDirty && 'dirty';
        const selectedOptionsLen = selectedDaysArrWithUnSet.length;
        return (
          <SegmentButton
            buttonState={activeState || dirtyState}
            count={isActive && selectedOptionsLen}
            {...toggleButtonProps}
          >
            {generateSegmentButtonText()}
          </SegmentButton>
        );
      }}
      extraPickers={getDayPickers(selectedDaysArr, onToggleDayPicker)}
      shouldCheckUpdate
    />
  );
};

DayOfWeekSegment.propTypes = {
  selectedDayOfWeek: PropTypes.shape({
    sunday: PropTypes.bool,
    monday: PropTypes.bool,
    tuesday: PropTypes.bool,
    wednesday: PropTypes.bool,
    thursday: PropTypes.bool,
    friday: PropTypes.bool,
    saturday: PropTypes.bool,
  }).isRequired,
  updateDayOfWeek: PropTypes.func.isRequired,
  rowCountByDayOfWeek: PropTypes.shape({
    '(not set)': PropTypes.number,
    sunday: PropTypes.number,
    monday: PropTypes.number,
    tuesday: PropTypes.number,
    wednesday: PropTypes.number,
    thursday: PropTypes.number,
    friday: PropTypes.number,
    saturday: PropTypes.number,
  }).isRequired,
};

export default memo(DayOfWeekSegment);

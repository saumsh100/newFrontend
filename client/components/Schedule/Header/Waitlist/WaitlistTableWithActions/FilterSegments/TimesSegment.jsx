
import React, { useMemo, memo, useCallback } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MultiSelect from '../../../../../library/ui-kit/MultiSelect';
import { generateWaitlistHours, getAllTimeSlots, getTimePickers, getTimeSlot } from '../../helpers';
import Account from '../../../../../../entities/models/Account';
import SegmentButton from '../../../../../library/SegmentButton';
import styles from './styles.scss';
import { NOT_SET_OPTION } from '../consts';

const TimesSegment = ({ account, timesRule, updateSelectedTimes }) => {
  const { rule: selectedTimes, isActive } = timesRule;
  const dirtyState = isActive && 'dirty';
  const selectedTimesKeys = Object.keys(selectedTimes);

  const handleSelectedTimesChange = useCallback(
    (times) => {
      times.forEach((time) => {
        selectedTimes[time] = true;
      });

      selectedTimesKeys
        .filter(key => !times.find(time => time === key))
        .forEach((key) => {
          selectedTimes[key] = false;
        });

      const updatedRule = {
        rule: selectedTimes,
        isActive: times.length > 0,
        showNotSet: selectedTimes['(not set)'],
      };
      updateSelectedTimes(updatedRule);
    },
    [selectedTimes, selectedTimesKeys, updateSelectedTimes],
  );

  const timezone = useMemo(() => account.get('timezone'), [account]);
  const timeOptions = useMemo(() => generateWaitlistHours(timezone).concat(NOT_SET_OPTION), [
    timezone,
  ]);

  const getSelectedOptions = useMemo(() => selectedTimesKeys.filter(time => selectedTimes[time]), [
    selectedTimes,
    selectedTimesKeys,
  ]);

  const onToggleTimePicker = useCallback(
    (data) => {
      const allChecked = data.every(time =>
        selectedTimesKeys.filter(key => selectedTimes[key]).includes(time));
      const newValue = selectedTimesKeys
        .filter(time => selectedTimes[time])
        .filter(time => !data.includes(time));
      if (allChecked) {
        handleSelectedTimesChange(newValue);
      } else {
        handleSelectedTimesChange([...newValue, ...data]);
      }
    },
    [handleSelectedTimesChange, selectedTimes, selectedTimesKeys],
  );

  const timeSlots = useMemo(() => {
    const options = timeOptions.map((option) => {
      option.slot = getTimeSlot(option.label);
      if (option.label === '(not set)') {
        option.slot = '(not set)';
      }
      return option;
    });

    const allTimeSlots = {
      ...getAllTimeSlots(options),
      '(not set)': { ...NOT_SET_OPTION,
        slot: '(not set)' },
    };

    return allTimeSlots;
  }, [timeOptions]);

  const getTimePickersMemo = useMemo(
    () => getTimePickers(getSelectedOptions, timeSlots, onToggleTimePicker),
    [getSelectedOptions, onToggleTimePicker, timeSlots],
  );

  return (
    <MultiSelect
      onChange={handleSelectedTimesChange}
      options={timeOptions}
      selected={getSelectedOptions}
      theme={{ listWrapper: classNames(styles.alignRight, styles.listWrapper) }}
      selector={(disabled, selectedItems, error, getToggleButtonProps) => {
        const toggleButtonProps = getToggleButtonProps();
        const activeState = toggleButtonProps['aria-expanded'] && 'active';
        const selectedOptionsLen = Object.values(selectedTimes).filter(val => val).length;
        return (
          <SegmentButton
            buttonState={activeState || dirtyState}
            {...toggleButtonProps}
            count={isActive && selectedOptionsLen}
          >
            Times
          </SegmentButton>
        );
      }}
      extraPickers={getTimePickersMemo}
      shouldCheckUpdate
    />
  );
};

TimesSegment.propTypes = {
  account: PropTypes.instanceOf(Account).isRequired,
  timesRule: PropTypes.shape({
    rule: PropTypes.shape({}).isRequired,
    isActive: PropTypes.bool.isRequired,
  }).isRequired,
  updateSelectedTimes: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth, entities }) => ({
  account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
});

export default memo(connect(mapStateToProps)(TimesSegment));

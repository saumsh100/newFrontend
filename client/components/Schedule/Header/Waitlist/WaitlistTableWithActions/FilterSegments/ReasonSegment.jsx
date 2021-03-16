
import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from '../../../../../../util/isomorphic';
import { convertArrayOfOptionsInMap } from '../../helpers';
import SegmentButton from '../../../../../library/SegmentButton';
import MultiSelect from '../../../../../library/ui-kit/MultiSelect';
import { NOT_SET_VALUE, NOT_SET_OPTION, DEFAULT_REASONS } from '../consts';
import styles from './styles.scss';

const ReasonSegment = ({ selectedReasons, updateReasons }) => {
  const { rule: reasonsFilter, isActive, showNotSet } = selectedReasons;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const selectedReasonsArr = Object.entries(reasonsFilter)
    .filter(([, v]) => v)
    .map(([v]) => v);
  const selectedReasonsArrWithUnSet = showNotSet
    ? selectedReasonsArr.concat([NOT_SET_VALUE])
    : selectedReasonsArr;
  const isDirty = selectedReasonsArrWithUnSet.length > 0;
  const allReasonsOptions = Object.keys(DEFAULT_REASONS)
    .map(reason => ({
      value: reason,
      label: capitalize(reason),
    }))
    .concat(NOT_SET_OPTION);

  const onReasonsChange = (values) => {
    setSelectedOptions(values);
    const reasons = values.filter(v => v !== NOT_SET_VALUE);
    const payload = {
      rule: convertArrayOfOptionsInMap(reasons, DEFAULT_REASONS),
      isActive: values.length !== 0,
      showNotSet: values.includes(NOT_SET_VALUE),
    };
    updateReasons(payload);
  };

  function generateSegmentButtonText() {
    const selectedOptionsCapitalized = selectedOptions.map(option => capitalize(option));
    const noSetSelected = selectedOptionsCapitalized.includes(capitalize(NOT_SET_VALUE));
    const selectedOptionsLength = selectedOptionsCapitalized.length;
    const selectedReasonsCapitalized = selectedOptionsCapitalized.filter(v => v !== NOT_SET_VALUE);

    if (selectedOptionsLength === 0) {
      return 'Reasons';
    }

    if (selectedOptionsLength === 1) {
      return noSetSelected
        ? `Reasons ${selectedOptionsCapitalized[0]}`
        : selectedOptionsCapitalized[0];
    }

    if (
      selectedReasonsCapitalized.length
      === allReasonsOptions.filter(v => v.value !== NOT_SET_VALUE).length
    ) {
      return 'All Reasons';
    }

    return selectedOptionsCapitalized.join(' + ');
  }

  return (
    <MultiSelect
      onChange={onReasonsChange}
      options={allReasonsOptions}
      selected={selectedReasonsArrWithUnSet}
      defaultValue={selectedReasonsArrWithUnSet}
      theme={{ listWrapper: styles.listWrapper }}
      selector={(disabled, selectedItems, error, getToggleButtonProps) => {
        const toggleButtonProps = getToggleButtonProps();
        const activeState = toggleButtonProps['aria-expanded'] && 'active';
        const dirtyState = isDirty && 'dirty';
        const selectedOptionsLen = selectedReasonsArrWithUnSet.length;
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
      shouldCheckUpdate
    />
  );
};

ReasonSegment.propTypes = {
  selectedReasons: PropTypes.shape({
    rule: PropTypes.shape({}),
    isActive: PropTypes.bool,
    showNotSet: PropTypes.bool,
  }).isRequired,
  updateReasons: PropTypes.func.isRequired,
};

export default memo(ReasonSegment);

import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import MultiSelect from '../../../../../library/ui-kit/MultiSelect';
import SegmentButton from '../../../../../library/SegmentButton';
import styles from './reskin-styles.scss';
import { NOT_SET_LABEL, NOT_SET_OPTION } from '../consts';

const PractitionersSegment = ({ practitionerRule, updatePractitioners }) => {
  const practitionerOptions = useMemo(
    () =>
      practitionerRule.rule
        .reduce((pract, curr) => {
          pract.push({ label: curr.label, value: curr.id });
          return pract;
        }, [])
        .concat(NOT_SET_OPTION),
    [practitionerRule.rule],
  );

  const handleSelectePractitioner = (practitionerIds) => {
    practitionerIds.forEach((id) => {
      const practitioner = practitionerRule.rule.find((pract) => pract.id === id);
      if (practitioner) {
        practitioner.selected = true;
      }
    });

    practitionerRule.rule
      .filter((pract) => !practitionerIds?.includes(pract?.id))
      .forEach((pract) => {
        pract.selected = false;
      });

    const update = {
      rule: practitionerRule.rule,
      isActive: practitionerIds.length > 0,
      showNotSet: practitionerIds?.includes(NOT_SET_LABEL),
    };

    updatePractitioners(update);
  };

  const getSelectedOptions = practitionerOptions
    .filter((pract) => {
      if (pract.label === NOT_SET_LABEL && practitionerRule.showNotSet) {
        return true;
      }
      return practitionerRule.rule.find((p) => p.id === pract.value)?.selected;
    })
    .reduce((arr, curr) => {
      arr.push(curr.value);
      return arr;
    }, []);

  return (
    <MultiSelect
      onChange={handleSelectePractitioner}
      options={practitionerOptions}
      selected={getSelectedOptions}
      theme={{ listWrapper: styles.listWrapper }}
      selector={(disabled, selectedItems, error, getToggleButtonProps) => {
        const toggleButtonProps = getToggleButtonProps();
        const activeState = toggleButtonProps['aria-expanded'] && 'active';
        return (
          <SegmentButton
            buttonState={activeState}
            {...toggleButtonProps}
            count={practitionerRule.isActive && getSelectedOptions.length}
          >
            Practitioners
          </SegmentButton>
        );
      }}
      shouldCheckUpdate
    />
  );
};

PractitionersSegment.propTypes = {
  practitionerRule: PropTypes.shape({
    rule: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
      }),
    ).isRequired,
    isActive: PropTypes.bool.isRequired,
  }).isRequired,
  updatePractitioners: PropTypes.func.isRequired,
};

export default memo(PractitionersSegment);

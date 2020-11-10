
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import MultiSelect from '../../../../../library/ui-kit/MultiSelect';
import SegmentButton from '../../../../../library/SegmentButton';
import styles from './styles.scss';

const PractitionersSegment = ({ practitionerRule, updatePractitioners }) => {
  const practitionerOptions = useMemo(
    () =>
      practitionerRule.rule.reduce((pract, curr) => {
        pract.push({ label: curr.label,
          value: curr.id });
        return pract;
      }, []),
    [practitionerRule.rule],
  );

  const handleSelectePractitioner = (practitionerIds) => {
    practitionerIds.forEach((id) => {
      const practitioner = practitionerRule.rule.find(pract => pract.id === id);
      practitioner.selected = true;
    });

    practitionerRule.rule
      .filter(pract => !practitionerIds.includes(pract.id))
      .forEach((pract) => {
        pract.selected = false;
      });

    const update = {
      ...practitionerRule,
      rule: practitionerRule.rule,
      isActive: practitionerIds.length > 0,
    };

    updatePractitioners(update);
  };

  const getSelectedOptions = useMemo(() => {
    practitionerRule.rule.filter(pract => pract.selected);
  }, [practitionerRule.rule]);

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
          <SegmentButton buttonState={activeState} {...toggleButtonProps}>
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

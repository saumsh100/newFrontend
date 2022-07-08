import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';
import SegmentButton from '../../../../../library/SegmentButton';
import { Checkbox } from '../../../../../library';
import styles from './reskin-styles.scss';

const UnitSegment = ({ unitsRule, updateUnitsRule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { rule: unitsFilter, isActive, showNotSet } = unitsRule;
  const activeState = isOpen && 'active';
  const dirtyState = isActive && 'dirty';
  const selectedOptionsLen = countActiveOptions();

  useEffect(() => {
    const validUnitsRange = Object.values(unitsFilter).filter((e) => e !== null).length > 0;
    if (showNotSet || validUnitsRange) {
      updateUnitsRule({
        ...unitsRule,
        isActive: true,
      });
    } else {
      updateUnitsRule({
        ...unitsRule,
        isActive: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitsFilter, showNotSet]);

  function toggleIsOpen() {
    setIsOpen((prev) => !prev);
  }

  function onUnitsRangeChangeHandler(key, val) {
    updateUnitsRule({
      ...unitsRule,
      rule: {
        ...unitsFilter,
        [key]: parseInt(val, 10) || null,
      },
    });
  }

  function onClearUnitsRange() {
    updateUnitsRule({
      ...unitsRule,
      rule: {
        min: null,
        max: null,
      },
    });
  }

  function onShowNotSetHandler() {
    updateUnitsRule({
      ...unitsRule,
      showNotSet: !showNotSet,
    });
  }

  function countActiveOptions() {
    let count = 0;
    const unitsFilterInUse = Object.values(unitsFilter).filter((val) => val !== null).length > 0;
    if (!isActive) {
      return count;
    }
    if (showNotSet) {
      count += 1;
    }
    if (unitsFilterInUse) {
      count += 1;
    }
    return count;
  }

  function generateSegmentButtonText() {
    const { min, max } = unitsFilter;
    let range;
    if (min === null && max === null) {
      range = null;
    } else if (min === null && max) {
      range = `1-${max}`;
    } else if (min && max === null) {
      range = `${min}+`;
    } else {
      range = `${min}-${max}`;
    }
    const punctuation = range ? ', ' : ' ';
    const notSetText = showNotSet ? `${punctuation}(not set)` : '';
    return `${range ? `${range} Units` : 'Units'}${notSetText}`;
  }

  return (
    <Popover
      isOpen={isOpen}
      body={
        <div className={styles.popOverCard}>
          <div className={styles.row}>
            <div className={styles.unitInputsWrapper}>
              <label className={styles.unitsLabel}>
                <span className={styles.unitsLabelText}>Minimum</span>
                <input
                  className={styles.unitsInput}
                  type="number"
                  step={1}
                  min={0}
                  value={unitsFilter.min || ''}
                  onChange={(e) => onUnitsRangeChangeHandler('min', e.target.value)}
                />
              </label>
              <label className={styles.unitsLabel}>
                <span className={styles.unitsLabelText}>Maximum</span>
                <input
                  className={styles.unitsInput}
                  type="number"
                  step={1}
                  min={0}
                  value={unitsFilter.max || ''}
                  onChange={(e) => onUnitsRangeChangeHandler('max', e.target.value)}
                />
              </label>
            </div>
            <button className={styles.clearButton} onClick={onClearUnitsRange}>
              Clear All
            </button>
          </div>
          <div className={styles.row}>
            <label className={styles.unsetUnitLabel}>(not set)</label>
            <Checkbox checked={showNotSet} onChange={onShowNotSetHandler} />
          </div>
        </div>
      }
      preferPlace="below"
      tipSize={0.01}
      className={styles.tooltip_Popover}
      onOuterAction={toggleIsOpen}
    >
      <SegmentButton
        buttonState={activeState || dirtyState}
        onClick={toggleIsOpen}
        count={isActive && selectedOptionsLen}
      >
        {generateSegmentButtonText()}
      </SegmentButton>
    </Popover>
  );
};

UnitSegment.propTypes = {
  unitsRule: PropTypes.shape({
    rule: PropTypes.shape({}),
    isActive: PropTypes.bool,
    showNotSet: PropTypes.bool,
  }).isRequired,
  updateUnitsRule: PropTypes.func.isRequired,
};

export default memo(UnitSegment);

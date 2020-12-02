
import React from 'react';
import PropTypes from 'prop-types';
import DataSlot from '../DataSlot';
import styles from './styles.scss';

const TimeList = ({ options, selectedValue, handleSelect, callback }) => (
  <div tabIndex="-1" className={styles.dropDownList} ref={callback}>
    {options.map((option, i) => (
      <DataSlot
        key={`options_${option.value}`}
        selected={selectedValue === option.value}
        option={option}
        type="button"
        onClick={e => handleSelect(e, option.value, i)}
      />
    ))}
  </div>
);

TimeList.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
  selectedValue: PropTypes.string,
  handleSelect: PropTypes.func.isRequired,
  callback: PropTypes.shape({ actual: PropTypes.string }),
};

TimeList.defaultProps = {
  selectedValue: null,
  callback: null,
};

export default TimeList;

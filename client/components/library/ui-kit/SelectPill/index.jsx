
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { capitalize } from '../../../../util/isomorphic';
import styles from './styles.scss';

const SelectPill = ({ options, defaultValue, selected, className, classNamePill, onChange }) => {
  const optionsRendered = options.map((option) => {
    const isSelected = selected === option.value || (!selected && option.value === defaultValue);
    return (
      <li
        key={option.value}
        className={classNames(styles.pill, classNamePill, { [styles.active]: isSelected })}
      >
        <button type="button" onClick={() => onChange(option.value)}>
          {option.label || capitalize(option.value)}
        </button>
      </li>
    );
  });

  return <ul className={classNames(styles.wrapper, className)}>{optionsRendered}</ul>;
};

SelectPill.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  selected: PropTypes.string,
  defaultValue: PropTypes.string,
  className: PropTypes.string,
  classNamePill: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

SelectPill.defaultProps = {
  options: [],
  selected: null,
  defaultValue: '',
  className: null,
  classNamePill: null,
};

export default SelectPill;

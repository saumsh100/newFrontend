
import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from '../../../../../util/isomorphic';
import Icon from '../../../../library/Icon';
import Input from '../../../../library/Input';
import styles from './styles.scss';

const Selector = ({
  disabled,
  selectorProps,
  formatValue,
  isEditable,
  selected,
  error,
  placeholder,
}) => (
  <div {...selectorProps} className={styles.input}>
    <Input
      disabled={!isEditable || disabled}
      name="ASD"
      error={error}
      label={placeholder}
      classStyles={styles.inputEl}
      value={selected.map(formatValue).join(', ')}
      autoComplete="off"
    />
    <div className={styles.iconWrapper}>
      <Icon icon="caret-down" type="solid" />
    </div>
  </div>
);

Selector.propTypes = {
  placeholder: PropTypes.string,
  selectorProps: PropTypes.objectOf(PropTypes.any),
  isEditable: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  error: PropTypes.bool,
  formatValue: PropTypes.func,
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

Selector.defaultProps = {
  selectorProps: {},
  placeholder: 'Selector a value',
  selected: [],
  error: false,
  formatValue: v => capitalize(v),
  isEditable: true,
};

export default Selector;

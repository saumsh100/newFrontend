
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../Button';
import Icon from '../Icon';
import styles from './styles.scss';

const Selector = ({ disabled, selectorProps, isEditable, selected, error, placeholder }) => (
  <Button
    {...selectorProps}
    className={classNames(styles.input, {
      [styles.disabled]: !isEditable || disabled,
      [styles.error]: error,
    })}
    disabled={!isEditable || disabled}
  >
    <div className={styles.value}>
      {selected.length > 0 ? (
        selected.reduce(
          (acc, curr, index, array) => (
            <span className={styles.item} key={curr.value}>
              {curr.label}
              {array.length > 1 &&
                ` + ${array.length - 1} account${array.length - 1 > 1 ? 's' : ''}`}
            </span>
          ),
          [],
        )
      ) : (
        <span className={styles.placeholder}>{placeholder}</span>
      )}
    </div>
    <div className={styles.iconWrapper}>
      <Icon icon="caret-down" type="solid" />
    </div>
  </Button>
);

Selector.propTypes = {
  placeholder: PropTypes.string,
  selectorProps: PropTypes.objectOf(PropTypes.any),
  isEditable: PropTypes.bool,
  handleSelection: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  error: PropTypes.bool,
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
  isEditable: true,
};

export default Selector;


import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../../library/Button';
import Icon from '../../../library/Icon';
import styles from './styles.scss';

const SentRecallSelector = ({
  disabled,
  isOpen,
  selectorProps,
  isEditable,
  selected,
  error,
  placeholder,
}) => (
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
        selected.map(({ value, label }, index) => (
          <span className={styles.item} key={value}>
            {label}
            {index === selected.length - 1 ? ' ' : ', '}
          </span>
        ))
      ) : (
        <span className={styles.placeholder}>{placeholder}</span>
      )}
    </div>
    <div
      className={
        isOpen ? classNames(styles.fieldLabelActive, styles.iconWrapper) : styles.iconWrapper
      }
    >
      <Icon icon="caret-down" type="solid" />
    </div>
  </Button>
);

SentRecallSelector.propTypes = {
  isOpen: PropTypes.bool.isRequired,
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

SentRecallSelector.defaultProps = {
  selectorProps: {},
  placeholder: 'Selector a value',
  selected: [],
  error: false,
  isEditable: true,
};

export default SentRecallSelector;

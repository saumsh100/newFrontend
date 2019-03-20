
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import Icon from '../Icon';
import styles from './styles.scss';

const Selector = ({
  disabled,
  selectorProps,
  isEditable,
  selected,
  handleSelection,
  placeholder,
}) => (
  <Button
    {...selectorProps}
    className={!isEditable || disabled ? styles.disabled : styles.input}
    disabled={!isEditable || disabled}
  >
    <div className={styles.value}>
      {selected.length > 0 ? (
        selected.map(({ id, label }) => (
          <span className={styles.item} key={id}>
            {label}{' '}
            <Icon
              icon="times"
              type="light"
              className={styles.remove}
              onClick={(e) => {
                e.stopPropagation();
                !disabled && handleSelection({ id });
              }}
            />
          </span>
        ))
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
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

Selector.defaultProps = {
  selectorProps: {},
  placeholder: 'Selector a value',
  selected: [],
  isEditable: true,
};

export default Selector;

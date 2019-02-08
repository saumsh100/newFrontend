
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
  options,
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
        selected.map(item => (
          <span className={styles.item} key={item}>
            {options.find(({ id }) => id === item).label}{' '}
            <Icon
              icon="times"
              type="light"
              className={styles.remove}
              onClick={(e) => {
                e.stopPropagation();
                !disabled && handleSelection({ id: item });
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
  selected: PropTypes.arrayOf(PropTypes.string),
  isEditable: PropTypes.bool,
  handleSelection: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  })),
};

Selector.defaultProps = {
  selectorProps: {},
  placeholder: 'Selector a value',
  selected: [],
  options: [],
  isEditable: true,
};

export default Selector;

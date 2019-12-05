
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';
import Checkbox from '../../../library/Checkbox';

const List = ({
  options,
  isOpen,
  itemProps,
  highlightedIndex,
  showFallback,
  selectedItems,
  toggleAllItems,
}) => (
  <ul className={classNames(styles.list, { [styles.active]: isOpen })}>
    {options.length > 0 ? (
      options.map((item, index) => {
        const selected = selectedItems.findIndex(value => value === item.value) !== -1;
        return (
          <li
            key={item.value}
            {...itemProps({
              item,
              index,
              isActive: highlightedIndex === index,
            })}
            className={styles.option}
          >
            <Checkbox checked={selected} label={item.label} labelClassNames={styles.cbLabel} />
          </li>
        );
      })
    ) : (
      <li className={classNames(styles.fallback, { [styles.active]: showFallback })}>
        All options are already selected
      </li>
    )}
    <li
      className={styles.selectAll}
      onClick={toggleAllItems}
      role="button" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
      tabIndex={0}
      onKeyDown={e => e.keyCode === 13 && toggleAllItems}
    >
      {selectedItems.length === options.length ? 'Unselect' : 'Select'} All Family Members
    </li>
  </ul>
);

List.propTypes = {
  highlightedIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  itemProps: PropTypes.func.isRequired,
  showFallback: PropTypes.bool,
  selectedItems: PropTypes.arrayOf(PropTypes.string),
  toggleAllItems: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

List.defaultProps = {
  highlightedIndex: null,
  isOpen: false,
  showFallback: false,
  options: [],
  selectedItems: [],
};

export default List;

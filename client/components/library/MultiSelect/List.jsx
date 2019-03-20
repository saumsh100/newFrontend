
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const List = ({ options, isOpen, itemProps, highlightedIndex, showFallback }) => (
  <ul className={classNames(styles.list, { [styles.active]: isOpen })}>
    {options.length > 0 ? (
      options.map((item, index) => (
        <li
          key={item.id}
          {...itemProps({
            item,
            index,
            isActive: highlightedIndex === index,
          })}
          className={styles.option}
        >
          {item.label}
        </li>
      ))
    ) : (
      <li className={classNames(styles.fallback, { [styles.active]: showFallback })}>
        All options are already selected
      </li>
    )}
  </ul>
);

List.propTypes = {
  highlightedIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  itemProps: PropTypes.func.isRequired,
  showFallback: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

List.defaultProps = {
  highlightedIndex: null,
  isOpen: false,
  showFallback: false,
  options: [],
};

export default List;


import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const List = ({ options, isOpen, itemProps, highlightedIndex }) => (
  <ul className={classNames(styles.list, { [styles.active]: isOpen })}>
    {options.map((item, index) => (
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
    ))}
  </ul>
);

List.propTypes = {
  highlightedIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  itemProps: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  })),
};

List.defaultProps = {
  highlightedIndex: null,
  isOpen: false,
  options: [],
};

export default List;


import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Checkbox from '../Checkbox';
import styles from './styles.scss';

const List = ({
  isOpen,
  selectedItems,
  availableItems,
  onChangeAll,
  hasAvailableItems,
  hasSelectedItems,
  handleSelection,
}) => (
  <ul className={classNames(styles.list, { [styles.active]: isOpen })}>
    <div className={styles.selectAll}>
      <Checkbox
        checked={hasSelectedItems}
        showIndeterminate={hasAvailableItems}
        label="Select All"
        labelClassNames={styles.cbLabel}
        onChange={onChangeAll}
      />
    </div>
    {hasSelectedItems && (
      <div className={styles.selectionGroup}>
        <span className={styles.selectionTitle}>Selected</span>
        {selectedItems.map(item => (
          <Checkbox
            checked
            label={item.label}
            labelClassNames={styles.cbLabel}
            containerClasses={styles.cbContainer}
            onChange={() => handleSelection(item)}
          />
        ))}
      </div>
    )}
    {hasAvailableItems && (
      <div className={styles.selectionGroup}>
        <span className={styles.selectionTitle}>Unselected</span>
        {availableItems.map(item => (
          <Checkbox
            label={item.label}
            labelClassNames={styles.cbLabel}
            containerClasses={styles.cbContainer}
            onChange={() => handleSelection(item)}
          />
        ))}
      </div>
    )}
  </ul>
);

List.propTypes = {
  isOpen: PropTypes.bool,
  onChangeAll: PropTypes.func.isRequired,
  handleSelection: PropTypes.func.isRequired,
  hasAvailableItems: PropTypes.bool.isRequired,
  hasSelectedItems: PropTypes.bool.isRequired,
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  availableItems: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

List.defaultProps = {
  isOpen: false,
  availableItems: [],
  selectedItems: [],
};

export default List;


import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Checkbox from '../../Checkbox';
import styles from './styles.scss';

const List = ({
  isOpen,
  selectedItems,
  availableItems,
  onChangeAll,
  hasAvailableItems,
  hasSelectedItems,
  handleSelection,
  extraPickers,
}) => (
  <ul className={classNames(styles.list, { [styles.active]: isOpen })}>
    <div className={styles.selectAll}>
      <Checkbox
        key="Select All"
        checked={hasSelectedItems}
        showIndeterminate={hasAvailableItems}
        label="Select All"
        labelClassNames={styles.cbLabel}
        onChange={onChangeAll}
      />
      {extraPickers &&
        extraPickers.map(picker => (
          <Checkbox
            key={picker.label}
            checked={picker.checked}
            showIndeterminate={picker.showIndeterminate}
            label={picker.label}
            labelClassNames={styles.cbLabel}
            onChange={picker.onChange}
          />
        ))}
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
  extraPickers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      checked: PropTypes.bool.isRequired,
      onChange: PropTypes.func.isRequired,
      showIndeterminate: PropTypes.bool.isRequired,
    }),
  ),
};

List.defaultProps = {
  isOpen: false,
  availableItems: [],
  selectedItems: [],
  extraPickers: [],
};

export default List;

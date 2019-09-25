
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../library/Button';
import Icon from '../../../../library/Icon';
import styles from '../styles.scss';

const FilterBodyDisplay = ({ formName, index, displayFilter, isOpen, headerTitle, children }) => (
  <div className={styles.filterBody}>
    <Button
      className={styles.filterHeader}
      onClick={() => displayFilter(formName, isOpen)}
      data-test-id={`collapsible_${index}`}
    >
      {headerTitle}
      <span className={styles.filterHeader_icon}>
        <Icon size={1.5} icon="caret-down" type="solid" />
      </span>
    </Button>
    <div style={{ display: isOpen ? 'block' : 'none' }} className={styles.collapsible}>
      {children}
    </div>
  </div>
);

FilterBodyDisplay.propTypes = {
  formName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  displayFilter: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  headerTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default FilterBodyDisplay;

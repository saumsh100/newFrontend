import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../../../library/Button';
import Icon from '../../../../library/Icon';
import styles from '../styles.scss';

const FilterBodyDisplay = ({ formName, index, displayFilter, isOpen, headerTitle, children }) => (
  <div className={styles.filterBody}>
    <Button
      className={classNames(styles.filterHeader, {
        [styles.filterHeader_open]: isOpen,
      })}
      onClick={() => displayFilter(formName, isOpen)}
      data-test-id={`collapsible_${index}`}
    >
      {headerTitle}
      {isOpen ? (
        <Icon size={1.5} icon="chevron-up" type="solid" className={styles.filterHeader_icon_open} />
      ) : (
        <Icon size={1.5} icon="chevron-down" type="solid" className={styles.filterHeader_icon} />
      )}
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

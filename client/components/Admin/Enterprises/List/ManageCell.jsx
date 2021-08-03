import React from 'react';
import PropTypes from 'prop-types';
import { Button, DropdownMenu } from '../../../library';
import styles from './styles.scss';
import EllipsisIcon from './EllipsisIcon';
import { accountShape, enterpriseShape } from '../../../library/PropTypeShapes';

const ManageCell = ({ index, value, onEdit, label }) => {
  return (
    <DropdownMenu
      className={styles.manageCellDropdown}
      onLabelClick={(e) => e.stopPropagation()}
      labelComponent={(props) => (
        <Button {...props} className={styles.ellipsisButton}>
          <EllipsisIcon />
        </Button>
      )}
    >
      <Button
        className={styles.actionItem}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(index, value);
        }}
      >
        Edit {label}
      </Button>
    </DropdownMenu>
  );
};

ManageCell.defaultProps = {
  value: null,
};

ManageCell.propTypes = {
  label: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.oneOfType(
    PropTypes.arrayOf(PropTypes.shape(accountShape)),
    PropTypes.arrayOf(PropTypes.shape(enterpriseShape)),
  ),
  onEdit: PropTypes.func.isRequired,
};

export default ManageCell;

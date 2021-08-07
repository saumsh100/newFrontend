import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, DropdownMenu } from '../../../library';
import styles from './styles.scss';
import EllipsisIcon from './EllipsisIcon';
import { getCollection } from '../../../Utils';
import { accountShape, enterpriseShape } from '../../../library/PropTypeShapes';

const ManageCell = ({ index, value, label, onEdit, onDelete }) => {
  const showDeleteButton = useSelector((state) => {
    const accounts = getCollection(
      state,
      'accounts',
      (account) => account.get('enterpriseId') === value.id,
    );
    return !accounts.length;
  });

  return (
    value && (
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
        <Button
          disabled={!showDeleteButton}
          className={styles.actionItem}
          onClick={(e) => {
            e.stopPropagation();
            showDeleteButton && onDelete(index, value);
          }}
        >
          Delete
        </Button>
      </DropdownMenu>
    )
  );
};

ManageCell.defaultProps = {
  value: null,
  onEdit: () => null,
  onDelete: () => null,
};

ManageCell.propTypes = {
  label: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.oneOfType(
    PropTypes.arrayOf(PropTypes.shape(accountShape)),
    PropTypes.arrayOf(PropTypes.shape(enterpriseShape)),
  ),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ManageCell;

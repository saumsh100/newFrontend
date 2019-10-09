
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, DropdownMenu, Icon, MenuItem } from '../../../library';
import ui from '../../../../ui-kit.scss';
import styles from './styles.scss';

export default function ActionsDropdown({ actionMenuItems, align, size }) {
  return (
    <DropdownMenu
      align={align}
      className={styles.patientActions}
      labelComponent={props => <ActionsButton size={size} {...props} />}
    >
      {actionMenuItems.map(({ key, ...itemProps }) => (
        <MenuItem key={key} {...itemProps} />
      ))}
    </DropdownMenu>
  );
}

ActionsDropdown.propTypes = {
  actionMenuItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  align: PropTypes.string,
  size: PropTypes.string,
};

ActionsDropdown.defaultProps = {
  align: 'left',
  size: 'md',
};

function ActionsButton({ size, ...props }) {
  const actionButtonSize =
    size === 'sm'
      ? styles.actionsButtonSmall
      : classNames(styles.actionsButtonNormal, ui.modal__save);
  const extendStyles = classNames(actionButtonSize, styles.actionsButton);
  return (
    <Button className={extendStyles} {...props}>
      {size !== 'sm' && <div className={styles.actionText}>Actions</div>}
      <Icon icon="caret-down" type="solid" className={styles.actionIcon} />
    </Button>
  );
}

ActionsButton.propTypes = {
  size: PropTypes.string.isRequired,
};


import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, DropdownMenu, Icon, MenuItem } from '../../../library';
import styles from './styles.scss';

export default function ActionsDropdown({ actionMenuItems, align, size, render }) {
  return (
    <DropdownMenu
      align={align}
      className={styles.patientActions}
      labelComponent={props => <ActionsButton size={size} render={render} {...props} />}
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
  render: PropTypes.func.isRequired,
};

ActionsDropdown.defaultProps = {
  align: 'right',
  size: 'md',
};

function ActionsButton({ size, ...props }) {
  const actionBtnSizeColor =
    size === 'sm' ? styles.actionsButtonSmall : styles.actionsButtonSmallBlack;
  const extendStyles = classNames(actionBtnSizeColor, styles.actionsButton);

  return props.render ? (
    props.render(props)
  ) : (
    <Button className={extendStyles} {...props}>
      <Icon icon="caret-down" type="solid" className={styles.actionIcon} />
    </Button>
  );
}

ActionsButton.propTypes = {
  size: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};


import React from 'react';
import PropTypes from 'prop-types';
import { Button, DropdownMenu, Icon, MenuItem } from '../../../library';
import ui from '../../../../ui-kit.scss';
import styles from './styles.scss';

const ActionsButton = props => (
  <Button className={`${ui.modal__save} ${styles.actionsButton}`} {...props}>
    <div>Actions</div>
    <Icon icon="caret-down" type="solid" />
  </Button>
);

export default function ActionsDropdown({ actionMenuItems, className, align }) {
  return (
    <DropdownMenu
      align={align}
      className={className}
      labelComponent={props => <ActionsButton {...props} />}
    >
      {actionMenuItems.map(({ key, ...itemProps }) => (
        <MenuItem key={key} {...itemProps} />
      ))}
    </DropdownMenu>
  );
}

ActionsDropdown.propTypes = {
  actionMenuItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  align: PropTypes.string,
};

ActionsDropdown.defaultProps = {
  className: null,
  align: 'left',
};

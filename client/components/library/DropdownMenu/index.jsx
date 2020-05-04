
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RDropdownMenu, { NestedDropdownMenu as RNestedDropdownMenu } from 'react-dd-menu';
import Icon from '../Icon';
import { ListItem } from '../List';
import styles from './styles.scss';

export const DropdownMenu = ({
  children,
  className,
  labelProps,
  closeOnInsideClick,
  align,
  upwards,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const close = ({ target }) => {
    const regTest = /daypicker/i;

    if (!regTest.test(target.className)) {
      setIsOpen(false);
    }
  };

  const menuOptions = {
    children,
    isOpen,
    close,
    toggle: <props.labelComponent {...labelProps} onClick={toggle} />,
    closeOnInsideClick,
    className: classNames(className, styles.dropdownContainer),
    align: align || 'right',
    upwards,
  };

  return <RDropdownMenu {...menuOptions} />;
};

DropdownMenu.defaultProps = {
  labelProps: {},
  upwards: false,
  className: '',
  closeOnInsideClick: true,
  align: '',
};

DropdownMenu.propTypes = {
  labelProps: PropTypes.objectOf(PropTypes.any),
  closeOnInsideClick: PropTypes.bool,
  align: PropTypes.string,
  upwards: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export const MenuItem = ({ icon, children, className, onClick }) => (
  <ListItem className={classNames(className, styles.menuItemLi)} onClick={onClick}>
    <div className={`dd-item-ignore ${styles.menuItemContent}`}>
      {icon ? <Icon icon={icon} className={styles.menuIcon} /> : null}
      {children}
    </div>
  </ListItem>
);

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
};

MenuItem.defaultProps = {
  icon: '',
  className: '',
  onClick: () => {},
};

export const MenuSeparator = () => <li role="separator" className="separator" />;

export const NestedDropdownMenu = props => <RNestedDropdownMenu {...props} />;

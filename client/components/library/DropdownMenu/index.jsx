import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RDropdownMenu, { NestedDropdownMenu as RNestedDropdownMenu } from 'react-dd-menu';
import Icon from '../Icon';
import { ListItem } from '../List';
import styles from './reskin-styles.scss';
import { Tooltip } from '..';

export const DropdownMenu = React.forwardRef(
  (
    { children, className, labelProps, closeOnInsideClick, align, upwards, onLabelClick, ...props },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = (e) => {
      onLabelClick(e, isOpen);
      setIsOpen(!isOpen);
    };

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
      clickToogle: toggle,
      toggle: <props.labelComponent {...labelProps} onClick={toggle} />,
      closeOnInsideClick,
      className: classNames(className, styles.dropdownContainer),
      align: align || 'right',
      upwards,
      ref,
    };

    return <RDropdownMenu {...menuOptions} />;
  },
);

DropdownMenu.defaultProps = {
  labelProps: {},
  upwards: false,
  className: '',
  closeOnInsideClick: true,
  align: '',
  onLabelClick: () => null,
};

DropdownMenu.propTypes = {
  labelProps: PropTypes.objectOf(PropTypes.any),
  closeOnInsideClick: PropTypes.bool,
  onLabelClick: PropTypes.func,
  align: PropTypes.string,
  upwards: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Wrapper = ({ children, disabled, tooltipText }) =>
  disabled && tooltipText ? <Tooltip overlay={tooltipText}>{children}</Tooltip> : <>{children}</>;

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.func.isRequired,
  tooltipText: PropTypes.string.isRequired,
};

export const MenuItem = ({ icon, children, className, onClick, disabled, tooltipText }) => {
  return (
    <Wrapper tooltipText={tooltipText} disabled={disabled}>
      <ListItem
        className={classNames(className, styles.menuItemLi)}
        disabled={disabled}
        onClick={onClick}
      >
        <div className={`dd-item-ignore ${styles.menuItemContent}`}>
          {icon ? <Icon icon={icon} className={styles.menuIcon} /> : null}
          <span className={styles.menuItemContent}>{children}</span>
        </div>
      </ListItem>
    </Wrapper>
  );
};

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.func,
  tooltipText: PropTypes.string,
};

MenuItem.defaultProps = {
  icon: '',
  className: '',
  onClick: () => {},
  disabled: false,
  tooltipText: null,
};

export const MenuSeparator = () => <li role="separator" className="separator" />;

export const NestedDropdownMenu = (props) => <RNestedDropdownMenu {...props} />;

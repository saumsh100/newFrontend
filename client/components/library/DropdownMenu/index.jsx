
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RDropdownMenu, { NestedDropdownMenu as RNestedDropdownMenu } from 'react-dd-menu';
import Button from '../Button';
import Icon from '../Icon';
import { ListItem } from '../List';
import styles from './styles.scss';

export class DropdownMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  close(e) {
    const className = e.target.className;

    const regTest = /daypicker/i;

    if (!regTest.test(className)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const { children, className, labelProps, closeOnInsideClick, align, upwards } = this.props;
    const classes = classNames(className, styles.dropdownContainer);

    const menuOptions = {
      // Required
      children,
      isOpen: this.state.isOpen,
      close: this.close,
      toggle: <this.props.labelComponent {...labelProps} onClick={this.toggle} data-test-id={this.props['data-test-id']}/>,

      // Default
      closeOnInsideClick,
      className: classes,
      align: align || 'right',
      upwards,
    };

    return <RDropdownMenu {...menuOptions} />;
  }
}

DropdownMenu.defaultProps = {
  labelProps: {},
};

DropdownMenu.propTypes = {
  labelProps: PropTypes.object,
  closeOnInsideClick: PropTypes.bool,
  align: PropTypes.string,
  upwards: PropTypes.bool,
};

export function MenuItem(props) {
  let icon = null;
  if (props.icon) {
    icon = <Icon icon={props.icon} className={styles.menuIcon} />;
  }

  const classes = classNames(props.className, styles.menuItemLi);
  return (
    <ListItem className={classes} onClick={props.onClick} data-test-id={props['data-test-id']}>
      <div className={`dd-item-ignore ${styles.menuItemContent}`}>
        {icon}
        {props.children}
      </div>
    </ListItem>
  );
}

export function MenuSeparator() {
  return <li role="separator" className="separator" />;
}

export function NestedDropdownMenu(props) {
  return <RNestedDropdownMenu {...props}/>;
}

DropdownMenu.propTypes = {


};

MenuItem.propTypes = {
  icon: PropTypes.string,
};

MenuSeparator.propTypes = {};

NestedDropdownMenu.propTypes = {};

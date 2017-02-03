
import React, { PropTypes, Component } from 'react';
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

  close() {
    this.setState({ isOpen: false });
  }

  render() {
    const { children, className } = this.props;
    const classes = classNames(className, styles.dropdownContainer);

    const menuOptions = {
      // Required
      children,
      isOpen: this.state.isOpen,
      close: this.close,
      toggle: <this.props.labelComponent onClick={this.toggle} />,

      // Default
      className: classes,
      align: 'right',
    };

    return <RDropdownMenu {...menuOptions} />;
  }
}

export function MenuItem(props) {
  let icon = null;
  if (props.icon) {
    icon = <Icon icon={props.icon} className={styles.menuIcon} />;
  }

  return (
    <ListItem className={styles.menuItemLi} onClick={props.onClick}>
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
  labelComponent: PropTypes.element.isRequired,
};

MenuItem.propTypes = {
  icon: PropTypes.string,
};

MenuSeparator.propTypes = {};

NestedDropdownMenu.propTypes = {};

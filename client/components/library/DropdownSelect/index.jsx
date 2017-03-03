
import React, { Component, PropTypes } from 'react';
import RDropdownMenu from 'react-dd-menu';
import classNames from 'classnames';
import Icon from '../Icon';
import { List, ListItem } from '../List';
import styles from './styles.scss';

function DefaultOption({ option }) {
  return (
    <div>
      {option.label || option.value}
    </div>
  );
}

export default class DropdownSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderToggle = this.renderToggle.bind(this);
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  close() {
    this.setState({ isOpen: false });
  }

  renderList() {
    const {
      template,
      options,
      onChange,
      value,
    } = this.props;

    const OptionTemplate = template || DefaultOption;

    return (
      <List className={styles.dropDownList}>
        {options.map((option, i) => {
          const isSelected = value === option.value;
          let className = styles.optionListItem;
          if (isSelected) {
            className = classNames(className, styles.selectedListItem);
          }

          return (
            <ListItem
              key={option.value + i}
              className={className}
              onClick={() => onChange(option.value)}
            >
              <div className={styles.optionDiv}>
                <OptionTemplate option={option} />
              </div>
            </ListItem>
          );
        })}
      </List>
    );
  }

  renderToggle() {
    const {
      value,
      disabled,
      options,
      label,
      template,
    } = this.props;

    const defaultTemplate = ({ option }) => (<div>{option.label || option.value}</div>);
    const ToggleTemplate = template || defaultTemplate;

    let toggleDiv = label;
    const option = options.find(opt => opt.value === value);
    if (option) {
      toggleDiv = <ToggleTemplate option={option} />;
    }

    return (
      <div
        className={disabled ? styles.toggleDivDisabled : styles.toggleDiv}
        onClick={disabled ? false : this.toggle}
      >
        <div className={styles.toggleValueDiv}>
          {toggleDiv}
        </div>
        <Icon className={styles.caretIcon} icon="caret-down" />
      </div>
    );
  }

  render() {
    const children = this.renderList();
    const toggle = this.renderToggle();

    const menuOptions = {
      children,
      toggle,
      align: 'right',
      isOpen: this.state.isOpen,
      close: this.close,
    };

    return <RDropdownMenu {...menuOptions} />;
  }
}

DropdownSelect.propTypes = {
  label: PropTypes.string,
  template: PropTypes.func,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

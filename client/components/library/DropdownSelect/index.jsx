
import React, { Component, PropTypes } from 'react';
import RDropdownMenu from 'react-dd-menu';
import Icon from '../Icon';
import { List, ListItem } from '../List';
import styles from './styles.scss';

function DefaultOption({ option }) {
  return (
    <div>
      {option.value}
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
    } = this.props;

    const OptionTemplate = template || DefaultOption;

    return (
      <List>
        {options.map((option, i) => {
          return (
            <ListItem key={option.value + i} onClick={() => onChange(option.value)}>
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
    const { value } = this.props;
    return (
      <div
        className={styles.toggleDiv}
        onClick={this.toggle}
      >
        <div className={styles.toggleValueDiv}>
          {value}
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
};

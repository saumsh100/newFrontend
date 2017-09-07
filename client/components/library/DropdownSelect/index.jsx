
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import RDropdownMenu from 'react-dd-menu';
import classNames from 'classnames';
import Icon from '../Icon';
import Input from '../Input';
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
      options: [],
      optionsStatic: [],
      value: '',
      searching: false,
    };

    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderToggle = this.renderToggle.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillMount() {
    this.setState({
      options: this.props.options || [],
      optionsStatic: this.props.options || [],
    });
  }

  toggle() {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false,
        options: this.state.optionsStatic,
        value: '',
      });
    } else {
      this.setState({
        isOpen: true,
      });
    }
  }

  close() {
    this.setState({
      isOpen: false,
      options: this.state.optionsStatic,
      value: '',
    });
  }

  handleSearch(value) {
    const {
      optionsStatic,
    } = this.state;

    const {
      search
    } = this.props;

    const test = (typeof search === 'string') ? search : 'value';

    if (value !== '') {
      const filteredOptions = optionsStatic.filter((option) => {
        if (new RegExp(value, 'i').test(option[test])) {
          return option;
        }
      });

      return this.setState({
        options: filteredOptions,
        value,
      });
    }

    return this.setState({
      options: optionsStatic,
      value: '',
    });
  }

  renderList() {
    const {
      template,
      onChange,
      value,
      search,
    } = this.props;

    const {
      options,
    } = this.state;

    const OptionTemplate = template || DefaultOption;

    return (
      <List className={styles.dropDownList} >
        {search ?
          <div className={styles.searchInput}>
            <Input
              label="Search"
              onChange={e => {
                this.handleSearch(e.target.value)
              }}
              onClick={(e) => {
                e.stopPropagation();
                this.setState({
                  searching: true,
                });
              }}
              value={this.state.value}
              icon="plus"
            />
          </div> : null}
        {options.map((option, i) => {
          const isSelected = value === option.value;
          let className = styles.optionListItem;
          if (isSelected) {
            className = classNames(className, styles.selectedListItem);
          }
          return (
            <ListItem
              key={`dropDownSelect_${i}`}
              className={className}
              onClick={() => {
                onChange(option.value)
                this.toggle()
              }}
              data-test-id={option.value}
            >
              <div className={styles.optionDiv} >
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
      options = [],
      label,
      template,
      borderColor,
    } = this.props;

    const defaultTemplate = ({ option }) => (<div>{option.label || option.value}</div>);
    const ToggleTemplate = template || defaultTemplate;

    let toggleDiv = null;
    const option = options.find(opt => opt.value === value);

    let labelClassName = styles.label;
    if (option) {
      toggleDiv = <ToggleTemplate option={option} />;
      labelClassName = classNames(styles.filled, labelClassName);
    }

    let toggleClassName = styles.toggleDiv;
    let caretIconClassName = styles.caretIcon;
    if (borderColor) {
      toggleClassName = classNames(styles[`${borderColor}Border`], toggleClassName);
    }

    if (this.state.isOpen) {
      toggleClassName = classNames(styles.active, toggleClassName);
      caretIconClassName = classNames(styles.activeIcon, caretIconClassName);
      labelClassName = classNames(styles.activeLabel, labelClassName);
    }

    return (
      <div
        className={disabled ? styles.toggleDivDisabled : toggleClassName}
        onClick={disabled ? false : this.toggle}
        data-test-id={this.props['data-test-id']}
      >
        <label className={labelClassName}>
          {label}
        </label>
        <div className={styles.toggleValueDiv}>
          {toggleDiv}
        </div>
        <Icon className={caretIconClassName} icon="caret-down" />
      </div>
    );
  }

  render() {
    const children = this.renderList();
    const toggle = this.renderToggle();
    const menuOptions = {
      children,
      toggle,
      align: this.props.align,
      isOpen: this.state.isOpen,
      close: this.close,
      animAlign: 'right',
      className: classNames(this.props.className, styles.wrapper),
      closeOnInsideClick: false,
      closeOnOutsideClick: true,
    };

    return <RDropdownMenu {...menuOptions} />;
  }
}

DropdownSelect.defaultProps = {
  align: 'left',
};

DropdownSelect.propTypes = {
  label: PropTypes.string,
  template: PropTypes.func,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  align: PropTypes.string,
};

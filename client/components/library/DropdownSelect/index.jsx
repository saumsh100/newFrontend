
import React, { Component, PropTypes } from 'react';
import RDropdownMenu from 'react-dd-menu';
import classNames from 'classnames';
import Icon from '../Icon';
import Input from '../Input';
import styles from './styles.scss';
import withTheme from '../../../hocs/withTheme';

function DefaultOption({ option }) {
  return (
    <div>
      {option.label || option.value}
    </div>
  );
}

class DropdownSelect extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();

    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderToggle = this.renderToggle.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.scrollComponentDidMount = this.scrollComponentDidMount.bind(this);
    this.valueScrollComponentDidMount = this.valueScrollComponentDidMount.bind(this);
    this.searchListener = this.searchListener.bind(this);
    this.clearSearchValue = this.clearSearchValue.bind(this);
  }

  getInitialState() {
    return {
      value: '',
      isOpen: false,
    };
  }

  componentWillMount() {
    this.clearSearchValue();
  }

  componentDidUpdate() {
    const options = this.props.options;
    if (this.props.value && this.state.isOpen) {
      let valueHeight = 0;

      options.forEach((option, index) => {
        if (option.value === this.props.value) {
          valueHeight = index;
        }
      });

      this.scrollComponent.scrollTop = valueHeight * this.valueScrollComponent.scrollHeight;
    }

    if (this.state.isOpen) {
      document.addEventListener('keydown', this.searchListener);
    }
  }

  componentWillUnmount() {
    this.clearSearchValue();
  }

  clearSearchValue() {
    this.searchValue = '';
  }

  searchListener(event) {
    if ((event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 186) {
      this.searchValue = this.searchValue + event.key;
      this.handleSearch(this.searchValue);
    }
  }

  scrollComponentDidMount(node) {
    this.scrollComponent = node;
  }

  valueScrollComponentDidMount(node) {
    this.valueScrollComponent = node;
  }

  toggle() {
    this.clearSearchValue();
    if (this.state.isOpen) {
      this.setState({
        isOpen: false,
        value: '',
      });
    } else {
      this.setState({
        isOpen: true,
      });
    }
  }

  close() {
    this.clearSearchValue();
    document.removeEventListener('keydown', this.searchListener);

    this.setState({
      isOpen: false,
      value: '',
    });
  }

  handleSearch(value) {
    const {
      options,
    } = this.props;

    const height = 40;

    if (value !== '') {
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const whichToSearch = option.label ? 'label' : 'value';
        if (new RegExp(value, 'i').test(option[whichToSearch])) {
          this.scrollComponent.scrollTop = i * height;
          break;
        }
      }
    }
  }

  renderList() {
    const {
      template,
      onChange,
      value,
      options
    } = this.props;

    const OptionTemplate = template || DefaultOption;

    return (
      <div className={styles.dropDownList} ref={this.scrollComponentDidMount}>
        {options.map((option, i) => {
          const isSelected = value === option.value;
          let className = styles.optionListItem;

          if (isSelected) {
            className = classNames(className, styles.selectedListItem);
          }

          return (
            <div
              key={`dropDownSelect_${i}`}
              className={className}
              onClick={() => {
                onChange(option.value);
                this.close();
              }}
              data-test-id={option.value}
              ref={isSelected ? this.valueScrollComponentDidMount : null}
            >
              <div
                className={styles.optionDiv}
              >
                <OptionTemplate option={option} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderToggle() {
    const {
      value,
      options = [],
      template,
      theme,
      error,
      disabled,
      label,
    } = this.props;

    const defaultTemplate = ({ option }) => (<div>{option.label || option.value}</div>);
    const ToggleTemplate = template || defaultTemplate;

    let toggleDiv = null;
    const option = options.find(opt => opt.value === value);

    let labelClassName = theme.label;

    if (option) {
      toggleDiv = <ToggleTemplate option={option} />;
      labelClassName = classNames(theme.filled, labelClassName);
    }

    let toggleClassName = theme.toggleDiv;
    const toggleValueClassName = theme.toggleValueDiv;
    let caretIconClassName = theme.caretIcon;

    if (this.state.isOpen) {
      toggleClassName = classNames(theme.active, toggleClassName);
      caretIconClassName = classNames(theme.activeIcon, caretIconClassName);
      labelClassName = classNames(theme.activeLabel, labelClassName);
    }

    if (error) {
      labelClassName = classNames(theme.errorLabel, labelClassName);
      caretIconClassName = classNames(theme.errorIcon, caretIconClassName);
      toggleClassName = classNames(theme.errorToggleDiv, toggleClassName);
    }

    return (
      <div
        className={disabled ? theme.toggleDivDisabled : toggleClassName}
        onClick={disabled ? false : this.toggle}
        data-test-id={this.props['data-test-id']}
      >
        <Input
          onFocus={disabled ? false : this.toggle}
          onBlur={this.close}
          className={theme.hiddenInput}
        />
        <div className={toggleValueClassName}>
          {toggleDiv}
          <label className={labelClassName}>
            {label}
          </label>
          <div className={theme.caretIconWrapper}>
            <Icon className={caretIconClassName} icon="caret-down" type="solid" />
          </div>
        </div>
        <div className={theme.error}>
          {error || ''}
        </div>
      </div>
    );
  }

  render() {
    const {
      theme,
    } = this.props;

    const children = this.renderList();
    const toggle = this.renderToggle();
    const menuOptions = {
      children,
      toggle,
      align: this.props.align,
      isOpen: this.state.isOpen,
      close: this.close,
      animAlign: 'right',
      className: classNames(this.props.className, theme.wrapper),
      closeOnInsideClick: false,
      closeOnOutsideClick: true,
      enterTimeout: 70,
      leaveTimeout: 70,
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
  search: PropTypes.string,
  theme: PropTypes.string,
};

export default withTheme(DropdownSelect, styles);

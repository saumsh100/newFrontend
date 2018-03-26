
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RDropdownMenu from 'react-dd-menu';
import classNames from 'classnames';
import styles from './styles.scss';
import withTheme from '../../../hocs/withTheme';
import SuggestionToggle from './SuggestionToggle';
import DataSlot from './DataSlot';

class DropdownSuggestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      sortedOptions: [],
    };
    this.currentValue = '';
    this.scrollIndex = 0;
    this.asInput = false;

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderToggle = this.renderToggle.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sortOptions = this.sortOptions.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.selectBeforeClose = this.selectBeforeClose.bind(this);
  }

  /**
   * Check if there's a defaultValue,
   * if yes let's fire the onChange method.
   *
   * Also set the currentValue and the scrollIndex,
   * as properties of the Class, this way React won't break the UX.
   */
  componentWillMount() {
    const { value, defaultValue, onChange, showAsInput } = this.props;
    const val = value || defaultValue;
    this.setState({ sortedOptions: this.sortOptions() }, () => {
      this.currentValue = val;
      this.asInput = val === showAsInput;
      this.scrollIndex = this.getIndex(this.props.renderValue(val));
    });
    if (val !== value) {
      onChange(val);
    }
  }

  /**
   * Update currentValue and scrollIndex,
   * based on the data from the nextProps.
   *
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.asInput = nextProps.value === this.props.showAsInput;
      this.currentValue = nextProps.value;
      this.scrollIndex = this.getIndex(this.props.renderValue(nextProps.value));
    }
  }

  /**
   * If the dropdown is open,
   * and there's a prop's value
   * let's scroll the dropdown to the specific index.
   */
  componentDidUpdate() {
    if (this.props.value && this.state.isOpen) {
      this.scrollTo(this.scrollIndex);
    }
  }

  /**
   * This will get the index of the value, or the closest one.
   *
   * @param {string} val
   */
  getIndex(val) {
    const { sortedOptions } = this.state;
    const { validateValue } = this.props;
    if (!validateValue(val)) {
      return false;
    }
    let item;
    if (this.props['data-test-id'] === 'time') {
      item = sortedOptions.find(opt => opt.value >= this.props.formatValue(val));
    } else {
      item = sortedOptions.find(opt => new RegExp(val, 'i').test(opt.label));
    }
    return item ? item.index : false;
  }

  /**
   * Opens the Dropdown
   */
  open() {
    this.setState({ isOpen: true });
  }

  /**
   * Closes the Dropdown
   */
  close() {
    this.setState({ isOpen: false });
  }
  /**
     * Toggle the dropdown
     */
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  /**
   * Sorts the list of options in an ascending way,
   * and set the current index as a key.
   */
  sortOptions() {
    return this.props.options
      .map((opt, index) => (opt = { ...opt, index }))
      .sort((a, b) => (a.value < b.value ? -1 : 1));
  }

  /**
   * Scroll to the provided index.
   *
   * @param {string} index
   */
  scrollTo(index) {
    if (this.suggestionsNode) {
      if (!this.state.isOpen) {
        this.open();
      }
      this.suggestionsNode.scrollTop = index * 40;
    }
  }

  /**
   * Handle the toggle change,
   * if it's a valid value,
   * we will scroll to it and assing it.
   *
   * @param {string} value
   */
  handleChange(value) {
    if (!this.state.isOpen) {
      this.open();
    }
    this.scrollIndex = this.getIndex(value);
    if (this.scrollIndex) {
      this.asInput = value === this.props.showAsInput;
      this.currentValue = value;
      this.scrollTo(this.scrollIndex);
    }
  }


  /**
   * Switch between the possible cases,
   * of a keyDown
   *
   * @param {object} e
   */
  handleKeydown(e) {
    const key = e.keyCode;
    switch (key) {
      case 9:
        this.selectBeforeClose();
        this.close();
        break;
      case 13:
        e.preventDefault();
        this.toggle();
        this.selectBeforeClose();
        break;
      case 40:
        this.navigateArrows('ArrowDown');
        break;
      case 38:
        this.navigateArrows('ArrowUp');
        break;
      default:
        break;
    }
  }

  /**
   * If the user has searched for a specific value,
   * but didn't select let's selecte it before closing the dropdown.
   *
   */
  selectBeforeClose() {
    const { value, onChange, formatValue } = this.props;
    const selected = this.props.options[this.scrollIndex];
    if (selected && selected.label !== this.currentValue && this.props['data-test-id'] !== 'time') {
      this.currentValue = selected.value;
    }
    const formatedValue = formatValue(this.currentValue);
    if (formatedValue !== value) {
      onChange(formatedValue);
    }
  }

  /**
   * With the given direction,
   * navigate up and down on the list
   *
   * @param {string} direction
   */
  navigateArrows(direction) {
    const { options, onChange } = this.props;
    const { isOpen } = this.state;

    if (direction === 'ArrowDown' && !isOpen) {
      this.setState({ isOpen: true });
    }
    let nextIndex = this.scrollIndex > -1 ? this.scrollIndex : -1;

    if (direction === 'ArrowDown') {
      nextIndex = (this.scrollIndex >= options.length - 1) ? 0 : this.scrollIndex + 1;
    }

    if (direction === 'ArrowUp') {
      nextIndex = (this.scrollIndex <= 0) ? options.length - 1 : this.scrollIndex - 1;
    }
    this.scrollIndex = nextIndex;
    onChange(options[nextIndex].value);
  }

  renderList() {
    return (
      <div tabIndex="-1" className={styles.dropDownList} ref={(node) => { this.suggestionsNode = node; }}>
        {this.props.options.map((option, i) => (
          <DataSlot
            key={i}
            {...this.props}
            selected={this.props.formatValue(this.currentValue) === option.value || this.props.value === option.value}
            option={option}
            onClick={(e) => {
              e.preventDefault();
              this.asInput = option.value === this.props.showAsInput;
              this.props.onChange(option.value);
              this.scrollIndex = i;
              this.close();
            }}
          />
        ))}
      </div>
    );
  }

  renderToggle() {
    return (
      <SuggestionToggle
        {...this.props}
        asInput={this.asInput}
        onClose={this.close}
        isOpen={this.state.isOpen}
        toggleView={this.toggle}
        handleBlur={this.selectBeforeClose}
        handleChange={this.handleChange}
        handleKeydown={this.handleKeydown}
        selected={{ value: this.props.value, label: this.props.renderValue(this.props.value, this.currentValue) }}
      />
    );
  }

  render() {
    const { theme } = this.props;

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

    return this.asInput ?
      <SuggestionToggle {...this.props} handleChange={this.props.onChange} asInput={this.asInput} /> :
      <RDropdownMenu {...menuOptions} />;
  }
}

DropdownSuggestion.propTypes = {
  renderValue: PropTypes.func,
  align: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  theme: PropTypes.object,
  showAsInput: PropTypes.string,
  formatValue: PropTypes.func,
  validateValue: PropTypes.func,
  'data-test-id': PropTypes.string,
  defaultValue: PropTypes.string,
};


export default withTheme(DropdownSuggestion, styles);

/**
 * Default format props
 */
const formatValue = value => value;

/**
 * Default render prop
 */
const renderValue = value => value;

/**
 * Default validate props
 */
const validateValue = val => val.length;

DropdownSuggestion.defaultProps = {
  formatValue,
  validateValue,
  renderValue,
};

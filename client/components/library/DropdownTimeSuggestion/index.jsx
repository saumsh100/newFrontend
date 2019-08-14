
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RDropdownMenu from 'react-dd-menu';
import DataSlot from '../DataSlot';
import withTheme from '../../../hocs/withTheme';
import SuggestionInput from './SuggestionInput';
import styles from './styles.scss';

class DropdownTimeSuggestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      sortedOptions: this.sortOptions(),
    };
    this.currentValue = props.value;
    this.scrollIndex = 0;
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
   * Using the default value,
   * set the scrollIndex of the item.
   */
  componentDidMount() {
    const { value } = this.props;
    this.scrollIndex = this.getIndex(this.props.renderValue(value));
  }

  /**
   * Update currentValue and scrollIndex,
   * based on the data from the nextProps.
   *
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
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
   * Gets the index of the passed value
   * or the closest one.
   *
   * @param {string} val
   */
  getIndex(val) {
    const item = this.getItem(val);
    return item ? item.index : false;
  }

  /**
   * Gets the object of the passed value
   * or the closest one.
   *
   * @param {string} val
   */
  getItem(val) {
    const { sortedOptions } = this.state;
    const { validateValue } = this.props;
    if (!validateValue(val)) {
      return false;
    }
    const formatedValue = this.props.formatValue(val);
    const item = sortedOptions.reduce((prev, curr) => (curr.value > formatedValue ? prev : curr));
    return item || false;
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
   * Sets the index of the option as a value of the object and
   * sorts the list in an ascending way.
   */
  sortOptions() {
    return this.props.options
      .map((opt, index) => ({
        ...opt,
        index,
      }))
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
        this.toggle();
      }
      this.suggestionsNode.scrollTop = index * 40;
    }
  }

  /**
   * Handle the changes,
   * having a valid value, scroll to it
   * and assing it as the current value.
   *
   * @param {string} value
   */
  handleChange(value) {
    if (!this.state.isOpen) {
      this.toggle();
    }
    const item = this.getItem(value);
    if (item) {
      this.scrollIndex = item.index;
      this.currentValue = this.props.strict ? item.value : value;
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
    if (this.props.disabled) return;
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
   * If the user has searched for a specific time,
   * but didn't select let's select it before closing the dropdown.
   *
   */
  selectBeforeClose() {
    const { value, onChange, formatValue } = this.props;
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
      this.toggle();
    }
    let nextIndex = this.scrollIndex > -1 ? this.scrollIndex : -1;

    if (direction === 'ArrowDown') {
      nextIndex = this.scrollIndex >= options.length - 1 ? 0 : this.scrollIndex + 1;
    }

    if (direction === 'ArrowUp') {
      nextIndex = this.scrollIndex <= 0 ? options.length - 1 : this.scrollIndex - 1;
    }
    this.scrollIndex = nextIndex;
    onChange(options[nextIndex].value);
  }

  /**
   * Renders the input that
   * the user is able to type
   */
  renderToggle() {
    return (
      <SuggestionInput
        {...this.props}
        options={this.props.options}
        onClose={this.close}
        isOpen={this.state.isOpen}
        toggleView={this.toggle}
        handleBlur={this.selectBeforeClose}
        handleChange={this.handleChange}
        handleKeydown={this.handleKeydown}
        selected={{
          value: this.props.value,
          label: this.props.renderValue(this.props.value, this.currentValue),
        }}
      />
    );
  }

  /**
   * Renders the dropdown list,
   * containing the DataSlots.
   */
  renderList() {
    return this.props.renderList(
      this.props,
      this.currentValue,
      this.scrollIndex,
      this.close,
      (node) => {
        this.suggestionsNode = node;
      },
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

    return <RDropdownMenu {...menuOptions} />;
  }
}

DropdownTimeSuggestion.propTypes = {
  renderValue: PropTypes.func,
  align: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  renderList: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  theme: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  formatValue: PropTypes.func,
  validateValue: PropTypes.func,
  'data-test-id': PropTypes.string,
  strict: PropTypes.bool,
};

export default withTheme(DropdownTimeSuggestion, styles);

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

const renderList = (props, currentValue, scrollIndex, close, callback) => (
  <div tabIndex="-1" className={styles.dropDownList} ref={callback}>
    {props.options.map((option, i) => (
      <DataSlot
        key={`options_${option.value}`}
        {...props}
        selected={currentValue === option.value || props.value === option.value}
        option={option}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          props.onChange(option.value);
          scrollIndex = i;
          close();
        }}
      />
    ))}
  </div>
);

renderList.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      labe: PropTypes.string,
    }),
  ).isRequired,
};

DropdownTimeSuggestion.defaultProps = {
  formatValue,
  renderList,
  validateValue,
  renderValue,
  theme: null,
  strict: true,
  disabled: false,
  className: undefined,
  value: undefined,
  'data-test-id': undefined,
  align: undefined,
};

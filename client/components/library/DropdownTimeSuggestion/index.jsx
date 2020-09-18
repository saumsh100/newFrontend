
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RDropdownMenu from 'react-dd-menu';
import withTheme from '../../../hocs/withTheme';
import SuggestionInput from './SuggestionInput';
import TimeList from './TimeList';
import styles from './styles.scss';

class DropdownTimeSuggestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      sortedOptions: this.sortOptions(),
      currentValue: props.value,
    };

    this.scrollIndex = 0;

    this.suggestionsNode = createRef();
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
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
    const { value, renderValue } = this.props;
    this.scrollIndex = this.getIndex(renderValue(value));
    this.setState({
      currentValue: renderValue(value),
    });
  }

  /**
   * update currentValue and scrollIndex, based on data from prevProps
   * @param {object} prevProps
   */
  componentDidUpdate(prevProps) {
    const { value, renderValue } = this.props;
    const { isOpen } = this.state;
    if (prevProps.value !== value) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        currentValue: renderValue(value),
      });
      this.scrollIndex = this.getIndex(renderValue(value));
    }
    // if dropdown is open and there's a prop value, scroll the dropdown to specific index
    if (value && isOpen) {
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
    const { validateValue, formatValue } = this.props;
    if (!validateValue(val)) {
      return false;
    }
    const formatedValue = formatValue(val);
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
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  /**
   * Sets the index of the option as a value of the object and
   * sorts the list in an ascending way.
   */
  sortOptions() {
    const { options } = this.props;
    return options
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
    const { isOpen } = this.state;
    if (this.suggestionsNode) {
      if (!isOpen) {
        this.toggle();
      }
      this.suggestionsNode.current.scrollTop = index * 40;
    }
  }

  /**
   * handle dropdown select
   */
  handleDropDownSelect = (e, value, index) => {
    const { onChange } = this.props;
    e.preventDefault();

    onChange(value);
    this.setState({
      currentValue: value,
    });
    this.scrollIndex = index;
    this.close();
  };

  /**
   * Handle the changes,
   * having a valid value, scroll to it
   * and assing it as the current value.
   *
   * @param {string} value
   */
  handleChange(value) {
    const { strict } = this.props;
    const { isOpen } = this.state;
    const item = this.getItem(value);

    if (!isOpen) {
      this.toggle();
    }

    if (item) {
      this.scrollIndex = item.index;

      this.setState({
        currentValue: strict ? item.value : value,
      });
      this.scrollTo(this.scrollIndex);
    } else {
      this.setState({
        currentValue: value,
      });
    }
  }

  /**
   * Switch between the possible cases,
   * of a keyDown
   *
   * @param {object} e
   */
  handleKeydown(e) {
    const { disabled } = this.props;

    if (disabled) return;
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
    const { currentValue } = this.state;
    const formatedValue = formatValue(currentValue);

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

  render() {
    const { theme, className, align, options, formatValue } = this.props;
    const { currentValue, isOpen } = this.state;
    const matchingOption = options.find(({ value }) => value === currentValue);
    const matchingValue = matchingOption && matchingOption.label;

    const menuOptions = {
      align,
      isOpen,
      children: (
        <TimeList
          options={options}
          selectedValue={formatValue(currentValue)}
          handleSelect={this.handleDropDownSelect}
          callback={this.suggestionsNode}
        />
      ),
      toggle: (
        <SuggestionInput
          {...this.props}
          onClose={this.close}
          isOpen={isOpen}
          toggleView={this.toggle}
          handleChange={this.handleChange}
          handleKeydown={this.handleKeydown}
          value={matchingValue || currentValue}
        />
      ),
      close: this.close,
      animAlign: 'right',
      className: classNames(className, theme.wrapper),
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

DropdownTimeSuggestion.defaultProps = {
  formatValue,
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

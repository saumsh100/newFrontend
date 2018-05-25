
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RDropdownMenu from 'react-dd-menu';
import classNames from 'classnames';
import withTheme from '../../../hocs/withTheme';
import SuggestionToggle from './SuggestionToggle';
import DataSlot from '../DataSlot';
import styles from './styles.scss';

class DropdownSuggestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
    this.currentValue = props.value;
    this.scrollIndex = this.getIndex(props.value);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.renderList = this.renderList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderToggle = this.renderToggle.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.selectBeforeClose = this.selectBeforeClose.bind(this);
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
      this.scrollIndex = this.getIndex(this.currentValue);
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
    const { validateValue } = this.props;
    if (!validateValue(val)) {
      return false;
    }
    return this.props.options.findIndex(opt => opt.value === val) || false;
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
   * Handle the data change,
   * if it's a valid value we will scroll to it
   *  and set it as the currentValue.
   *
   * @param {string} value
   */
  handleChange(value) {
    if (!this.state.isOpen) {
      this.open();
    }
    const index = this.getIndex(value);
    if (index > -1) {
      this.scrollIndex = index;
      this.currentValue = value;
      this.scrollTo(this.scrollIndex);
      this.props.onChange(value);
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
   * but didn't selected let's select it before closing the dropdown.
   *
   */
  selectBeforeClose() {
    const { onChange } = this.props;
    const selected = this.props.options[this.scrollIndex];
    if (selected && selected.value !== this.currentValue) {
      this.currentValue = selected.value;
      onChange(this.currentValue);
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
      nextIndex = this.scrollIndex >= options.length - 1 ? 0 : this.scrollIndex + 1;
    }

    if (direction === 'ArrowUp') {
      nextIndex = this.scrollIndex <= 0 ? options.length - 1 : this.scrollIndex - 1;
    }
    this.scrollIndex = nextIndex;
    onChange(options[nextIndex].value);
  }

  renderToggle() {
    return (
      <SuggestionToggle
        {...this.props}
        isOpen={this.state.isOpen}
        toggleView={this.toggle}
        handleBlur={this.selectBeforeClose}
        handleChange={this.handleChange}
        handleKeydown={this.handleKeydown}
        selected={{
          value: this.currentValue,
          label: this.props.renderValue(this.currentValue),
        }}
      />
    );
  }

  renderList() {
    return this.props.renderList(
      this.props,
      this.currentValue,
      this.scrollIndex,
      this.close,
      (node) => {
        this.suggestionsNode = node;
      }
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

DropdownSuggestion.propTypes = {
  align: PropTypes.string,
  className: PropTypes.string,
  'data-test-id': PropTypes.string,
  defaultValue: PropTypes.string,
  formatValue: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  renderList: PropTypes.func,
  renderValue: PropTypes.func,
  strict: PropTypes.bool,
  theme: PropTypes.object,
  validateValue: PropTypes.func,
  value: PropTypes.string,
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

/**
 * The default renderList function.
 *
 * @param props
 * @param currentValue
 * @param scrollIndex
 * @param close
 * @param callback
 * @returns {*}
 */
const renderList = (props, currentValue, scrollIndex, close, callback) => (
  <div tabIndex="-1" className={styles.dropDownList} ref={callback}>
    {props.options.map((option, i) => (
      <DataSlot
        key={i}
        {...props}
        selected={currentValue === option.value}
        option={option}
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
  onChange: PropTypes.func,
  options: PropTypes.array,
};

DropdownSuggestion.defaultProps = {
  renderList,
  formatValue,
  renderValue,
  strict: true,
  validateValue,
};
